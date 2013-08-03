from readbot import ReadBot

rb = ReadBot()

print '------------------'
print '- Testing images -'
print ''
# result = rb.interpret('./tempImages/1.jpeg')
# result = rb.interpret('./tempImages/2.png')
result = rb.interpret('./tempImages/3.png')
print result
print ''
print '------------------'