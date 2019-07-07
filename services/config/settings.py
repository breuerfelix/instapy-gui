from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
import json

settings = Blueprint('settings', __name__)

@settings.route('/settings', methods=['GET'])
@jwt_req
def get_settings(payload):
    result = client.configuration.settings.find({ 'username': payload['username'] })
    return to_json(result)



@settings.route('/settings', methods=['POST'])
@jwt_req
def update_settings(payload):
    username = payload['username']
    body = json.loads(request.data)
    setting = body['data']

    table = client.configuration.settings

    if body['action'] == 'add':
        result = table.find_one({ 'ident': setting['ident'], 'username': username })

        if result:
            return to_json({
                'error': 'ident already used!'
            })

        table.insert_one({
            'ident': setting['ident'],
            'username': username,
            'name': setting['name'],
            'description': setting['description'],
            'params': []
        })

    # return the given setting to approve
    return to_json(setting)