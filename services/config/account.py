import json
from flask import Blueprint, request
from tinydb import where

from config import db

account = Blueprint('account', __name__)


@account.route('/login', methods=['GET'])
def get_credentials():
    result = db.get(where('type') == 'account')
    username = None

    if result:
        username = result['username']

    return json.dumps({ 'username': username })



@account.route('/login', methods=['POST'])
def set_credentials():
    body = json.loads(request.data)
    body['type'] = 'account'

    result = db.upsert(body, where('type') == 'account')
    return json.dumps({ 'done': True })
