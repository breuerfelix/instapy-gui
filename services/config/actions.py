import json
from flask import Blueprint
from tinydb import where

import sys
sys.path.append('../')
from python_shared import action_table as db

actions = Blueprint('actions', __name__)


@actions.route('/actions', methods=['GET'])
def get_actions():
    result = db.all()
    return json.dumps(result)
