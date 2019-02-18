import json

from flask import Flask, request
from flask_cors import CORS

from config import actions, namespaces


PORT = 3000

app = Flask(__name__)
app.register_blueprint(actions)
app.register_blueprint(namespaces)

CORS(app)


if __name__ == '__main__':
    print('starting server....')
    #eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
    app.run(debug=True, port=PORT)
    #init_db()
