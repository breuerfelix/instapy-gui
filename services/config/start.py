#!/usr/bin/env python
import eventlet
import eventlet.wsgi

from flask import Flask, request
from flask_cors import CORS

from os import getenv

from actions import actions
from namespaces import namespaces
from settings import settings

from database import client

app = Flask(__name__)
app.register_blueprint(actions)
app.register_blueprint(namespaces)
app.register_blueprint(settings)

CORS(app)

if __name__ == '__main__':
    print('starting config server....')

    PORT = getenv('PORT') or 80
    PORT = int(PORT)
    mode = getenv('MODE') or 'production'

    if mode == 'development':
        app.run(debug = True, host = '0.0.0.0', port = PORT)
    else:
        eventlet.wsgi.server(eventlet.listen(('', PORT)), app)

    client.close()