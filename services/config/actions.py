import json
from flask import Blueprint
from tinydb import where

from config import db

actions = Blueprint('actions', __name__)


@actions.route('/actions', methods=['GET'])
def get_actions():
    result = db.search(where('type') == 'action')
    return json.dumps(result)
