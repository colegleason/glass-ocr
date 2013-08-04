import os
import io
import webapp2
import json
from google.appengine.api import taskqueue
from google.appengine.ext import db
import cloudstorage as gcs

from oauth2client.appengine import StorageByKeyName
from model import Credentials
from apiclient.http import MediaIoBaseUpload
from google.appengine.api import urlfetch, taskqueue
import httplib2

import logging
import util

from PIL import Image, ImageOps

class PreProcessWorker(webapp2.RequestHandler):
    def post(self):
        id = self.request.get('id')
        userid = self.request.get('userid')
        logging.info(id)
        retry_params = gcs.RetryParams(backoff_factor=1.1)
        orig_file = gcs.open('/original_images/' + id, 'r',
                            retry_params=retry_params)
        img = Image.open(orig_file)
        w, h = img.size
        img = img.resize((2*w, 2*h))
        img = ImageOps.grayscale(img)
        output_file = gcs.open('/processed_images/' + id, 'w',
                               content_type='application/pdf',
                            retry_params=retry_params)
        img.save(output_file, 'PDF')
        orig_file.close()
        output_file.close()
        taskqueue.add(url='/driveupload', params={'id': id, 'contentType': 'application/pdf', 'userid': userid})

class DriveUploadWorker(webapp2.RequestHandler):
    def post(self):
        urlfetch.set_default_fetch_deadline(45)
        httplib2.Http(timeout=45)
        userid = self.request.get('userid')
        drive_service = util.create_service(
        'drive', 'v2',
        StorageByKeyName(Credentials, userid, 'credentials').get())

        id = self.request.get('id')
        logging.debug(id)
        content_type = self.request.get('contentType')
        retry_params = gcs.RetryParams(backoff_factor=1.1)
        img = gcs.open('/processed_images/' + id, 'r',
                       retry_params=retry_params)
        media_body = MediaIoBaseUpload(
            img, mimetype=content_type, resumable=True)
        logging.info(media_body)
        try:
            file = drive_service.files().insert(
                media_body=media_body,
                ocr=True,
                convert=True
            ).execute()



            taskqueue.add(url='/drivefetch', params={'fileid': file['id'], 'id': id, 'userid':userid})
        except Exception, e:
            logging.error(e)
        finally:
            img.close()


class DriveFetchWorker(webapp2.RequestHandler):
    def post(self):
        userid = self.request.get('userid')
        drive_service = util.create_service(
        'drive', 'v2',
        StorageByKeyName(Credentials, userid, 'credentials').get())

        id = self.request.get('id')
        logging.info(id)
        fileid = self.request.get('fileid')
        file_data = drive_service.files().get(fileId=fileid).execute()
        logging.debug(file_data)
        if (file_data.get('exportLinks')):
            download_url = file_data.get('exportLinks').get('text/plain')
        else:
            download_url = file_data['downloadUrl']
        resp, content = drive_service._http.request(download_url)
        if resp.status == 200:
            retry_params = gcs.RetryParams(backoff_factor=1.1)
            out = gcs.open('/original_text/' + id, 'w',
                           retry_params=retry_params)
            out.write(content)
            out.close()
            taskqueue.add(url='/postprocess', params={'id': id, 'userid': userid})
        else:
            logging.error(resp)


class PostProcessWorker(webapp2.RequestHandler):
    def post(self):
        userid = self.request.get('userid')
        mirror_service = util.create_service(
        'mirror', 'v1',
        StorageByKeyName(Credentials, userid, 'credentials').get())

        id = self.request.get('id')
        logging.info(id)
        retry_params = gcs.RetryParams(backoff_factor=1.1)
        out = gcs.open('/original_text/' + id, 'r',
                           retry_params=retry_params)
        text = out.read()
        logging.info(text)
        body = {
            'text': text
        }
        mirror_service.timeline().insert(body=body).execute()

TASKS_ROUTES = [
    ('/preprocess', PreProcessWorker),
    ('/driveupload', DriveUploadWorker),
    ('/drivefetch', DriveFetchWorker),
    ('/postprocess', PostProcessWorker)
]
