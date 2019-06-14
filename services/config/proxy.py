from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
import json

proxy = Blueprint('proxy', __name__)

@proxy.route('/proxy', methods=['GET'])
@jwt_req
def get_proxy_config(payload):
    result = client.configuration.proxies.find_one({ 'username': payload['username'] })
    if not result:
        return to_json({
            'host': '',
            'port': '',
            'username': '',
            'password': ''
        })

    result['username'] = result['proxy_username']
    del result['proxy_username']

    return to_json(result)



@proxy.route('/proxy', methods=['POST'])
@jwt_req
def set_proxy_config(payload):
    username = payload['username']
    body = json.loads(request.data)

    table = client.configuration.proxies
    table.delete_one({ 'username': username })
    table.insert_one({
        'username': username,
        'host': body['host'],
        'port': body['port'],
        'proxy_username': body['username'],
        'password': body['password']
    })

    return to_json({ 'done': True })
