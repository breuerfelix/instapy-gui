#!/usr/bin/env python

import json
import eventlet
import eventlet.wsgi

from flask import Flask, request
from flask_cors import CORS

import sys
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
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
    #app.run(debug=True, port=PORT)
    db.close()
