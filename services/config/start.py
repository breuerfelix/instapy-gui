#!/usr/bin/env python

import json
import eventlet
import eventlet.wsgi

from flask import Flask, request
from flask_cors import CORS

import sys
from os import getenv
sys.path.append('../')
from python_shared import db, init_db

from account import account
from actions import actions
from namespaces import namespaces

PORT = 80

app = Flask(__name__)
app.register_blueprint(actions)
app.register_blueprint(namespaces)
app.register_blueprint(account)

CORS(app)

if __name__ == '__main__':
    print('starting config server....')
    init_db()

    mode = getenv('MODE') or 'production'
    if mode == 'development':
        app.run(debug=True, host='0.0.0.0', port=PORT)
    else:
        eventlet.wsgi.server(eventlet.listen(('', PORT)), app)

    db.close()
