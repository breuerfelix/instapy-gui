import json
from os import getenv
from flask import Blueprint, request
from auth import to_json, jwt_req, encode, decode
from database import client

CIPHER_SECRET = getenv('CIPHER_SECRET') or 'instapysecret'
account = Blueprint('account', __name__)

@account.route('/login', methods=['GET'])
@jwt_req
def get_credentials(payload):
    username = payload['username']
    result = client.auth.instagram.find_one({ 'username': username })

    if not result:
        return to_json({ 'username': None })

    instagram_username = None
    password = None
    try:
        instagram_username = decode(result['instagram_username'], CIPHER_SECRET)
        password = decode(result['password'], CIPHER_SECRET)
    except:
        instagram_username = None

    return to_json({ 'username': instagram_username, 'password': password })



@account.route('/login', methods=['POST'])
@jwt_req
def set_credentials(payload):
    body = json.loads(request.data)
    username = payload['username']

    table = client.auth.instagram
    table.delete_one({ 'username': username })
    table.insert_one({
        'username': username,
        'instagram_username': encode(body['username'], CIPHER_SECRET),
        'password': encode(body['password'], CIPHER_SECRET)
    })

    return to_json({ 'done': True })