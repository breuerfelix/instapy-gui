from flask import Blueprint
from database import client
from auth import to_json

actions = Blueprint('actions', __name__)

@actions.route('/actions', methods=['GET'])
def get_actions():
    actions = client.general.actions.find()
    return to_json(actions)
