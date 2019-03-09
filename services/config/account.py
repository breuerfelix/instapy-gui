from flask import Blueprint, request
from auth import to_json, jwt_req
from database import client
import json

account = Blueprint('account', __name__)

@account.route('/login', methods=['GET'])
@jwt_req
def get_credentials(payload):
    result = client[payload['database']].account.find_one()

    return to_json({ 'username': result['username'] if result else None })



@account.route('/login', methods=['POST'])
@jwt_req
def set_credentials(payload):
    body = json.loads(request.data)

    table = client[payload['database']].account
    table.delete_one({})
    table.insert_one(body)

    return to_json({ 'done': True })
