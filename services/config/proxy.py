from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
import json

proxy = Blueprint('proxy', __name__)

@proxy.route('/proxy', methods=['GET'])
@jwt_req
def get_proxy_config(payload):
    result = client[payload['database']].proxy.find_one()
    if not result:
        return to_json({
            'host': '',
            'port': '',
            'username': '',
            'password': ''
        })

    return to_json(result)



@proxy.route('/proxy', methods=['POST'])
@jwt_req
def set_proxy_config(payload):
    body = json.loads(request.data)

    table = client[payload['database']].proxy
    table.delete_one({})
    table.insert_one(body)

    return to_json({ 'done': True })
