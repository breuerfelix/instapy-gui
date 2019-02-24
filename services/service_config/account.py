import json
from flask import Blueprint, request
from tinydb import where

from src import account_table

account = Blueprint('account', __name__)

# TODO remove type account when we have more than one account

@account.route('/login', methods=['GET'])
def get_credentials():
    result = account_table.get(where('type') == 'account')
    username = None

    if result:
        username = result['username']

    return json.dumps({ 'username': username })



@account.route('/login', methods=['POST'])
def set_credentials():
    body = json.loads(request.data)
    body['type'] = 'account'

    result = account_table.upsert(body, where('type') == 'account')
    return json.dumps({ 'done': True })
