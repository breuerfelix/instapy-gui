from os import getenv
from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req, encode, decode
import json
from bson.json_util import dumps

CIPHER_SECRET = getenv('CIPHER_SECRET') or 'instapysecret'
settings = Blueprint('settings', __name__)


def coding_wrapper(text, func):
    if text == None or text == '':
        return text

    return func(text, CIPHER_SECRET)


@settings.route('/settings', methods=['GET'])
@jwt_req
def get_settings(payload):
    result = client.configuration.settings.find({'username': payload['username']})
    result = json.loads(dumps(result))

    # decode instagram credentials
    for res in result:
        for param in res['params']:
            if param['name'] != 'username' and param['name'] != 'password':
                continue

            param['value'] = coding_wrapper(param['value'], decode)

    return to_json(result)


@settings.route('/settings/<setting>', methods=['GET'])
@jwt_req
def get_setting(payload, setting):
    result = client.configuration.settings.find_one(
        {'username': payload['username'], 'ident': setting}
    )
    result = json.loads(dumps(result))

    # decode instagram credentials
    for param in result['params']:
        if param['name'] != 'username' and param['name'] != 'password':
            continue

        param['value'] = coding_wrapper(param['value'], decode)

    return to_json(result)


@settings.route('/settings', methods=['POST'])
@jwt_req
def update_settings(payload):
    username = payload['username']
    body = json.loads(request.data)
    setting = body['data']

    table = client.configuration.settings

    if body['action'] == 'add':
        result = table.find_one({'ident': setting['ident'], 'username': username})

        if result:
            return to_json({'error': 'Ident already used!'})

        table.insert_one(
            {
                'ident': setting['ident'],
                'username': username,
                'name': setting['name'],
                'description': setting['description'],
                'params': [],
            }
        )

    elif body['action'] == 'delete':
        result = table.delete_one({'ident': setting['ident'], 'username': username})
        return to_json({'done': True})

    elif body['action'] == 'update':
        # encode instagram credentials
        for param in setting['params']:
            if param['name'] != 'password' and param['name'] != 'username':
                continue

            param['value'] = coding_wrapper(param['value'], encode)

        result = table.find_one_and_update(
            {'ident': setting['ident'], 'username': username},
            {'$set': {'params': setting['params']}},
        )
        return to_json({'done': True})

    # return the given setting to approve
    return to_json(setting)
