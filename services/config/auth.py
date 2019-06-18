import jwt
import json
import base64
from functools import wraps
from flask import request, current_app
from os import getenv
from bson.json_util import dumps

SECRET = getenv('JWT_SECRET') or 'instapysecret'

def to_json(obj, status = 200):
    return current_app.response_class(
        dumps(obj, indent = None),
        mimetype = 'application/json',
        status = status
    )



def jwt_req(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            print('error: no token provided')
            return to_json({ 'error': 'no token provided' }, 400)

        payload = None

        try:
            token = token.split(' ')[1]
            payload = jwt.decode(token, SECRET, algorithms = ['HS256'])
        except:
            print('error: decoding token')
            return to_json({ 'error': 'decoding token' }, 400)

        if not payload:
            print('error: no payload')
            return to_json({ 'error': 'no payload' }, 400)

        if not payload['username']:
            print('error: no username')
            return to_json({ 'error': 'no username in payload' })

        return f(*args, payload = payload, **kwargs)
    return decorated_function



def encode(string, key):
    encoded_chars = []
    for i in range(len(string)):
        key_c = key[i % len(key)]
        encoded_c = chr(ord(string[i]) + ord(key_c) % 256)
        encoded_chars.append(encoded_c)
    encoded_string = ''.join(encoded_chars)
    encoded_string = encoded_string.encode('latin')
    return base64.urlsafe_b64encode(encoded_string).rstrip(b'=')



def decode(string, key):
    string = base64.urlsafe_b64decode(string + b'===')
    string = string.decode('latin')
    encoded_chars = []
    for i in range(len(string)):
        key_c = key[i % len(key)]
        encoded_c = chr((ord(string[i]) - ord(key_c) + 256) % 256)
        encoded_chars.append(encoded_c)
    encoded_string = ''.join(encoded_chars)
    return encoded_string