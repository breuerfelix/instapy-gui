import jwt
import json
from functools import wraps
from flask import request, current_app
from os import getenv
from bson.json_util import dumps
from cryptography.fernet import Fernet

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
            return to_json({ 'error': 'no token provided', 'type': 'auth' }, 400)

        payload = None

        try:
            token = token.split(' ')[1]
            payload = jwt.decode(token, SECRET, algorithms = ['HS256'])
        except:
            print('error: decoding token')
            return to_json({ 'error': 'decoding token', 'type': 'auth' }, 400)

        if not payload:
            print('error: no payload')
            return to_json({ 'error': 'no payload', 'type': 'auth' }, 400)

        if not payload['username']:
            print('error: no username')
            return to_json({ 'error': 'no username in payload', 'type': 'auth' }, 400)

        return f(*args, payload = payload, **kwargs)
    return decorated_function



def encode(message, key):
    return Fernet(key.encode()).encrypt(message.encode()).decode()



def decode(message, key):
    return Fernet(key.encode()).decrypt(message.encode()).decode()