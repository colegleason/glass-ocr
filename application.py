from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html", name="my friend")

if __name__ == "__main__":
    app.debug = True
    app.run()
