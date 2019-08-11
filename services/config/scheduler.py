from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
import json
from bson.json_util import dumps

scheduler = Blueprint('scheduler', __name__)


@scheduler.route('/scheduler', methods=['GET'])
@jwt_req
def get_scheduler(payload):
    result = client.configuration.scheduler.find({'username': payload['username']})
    return to_json(result)


@scheduler.route('/scheduler/<schedule>', methods=['GET'])
@jwt_req
def get_schedule(payload, schedule):
    result = client.configuration.scheduler.find_one(
        {'username': payload['username'], 'ident': schedule}
    )
    return to_json(result)


@scheduler.route('/scheduler', methods=['POST'])
@jwt_req
def update_scheduler(payload):
    username = payload['username']
    body = json.loads(request.data)
    schedule = body['data']
    action = body['action']

    table = client.configuration.scheduler

    if action == 'add':
        result = table.find_one({'ident': schedule['ident'], 'username': username})

        if result:
            return to_json({'error': 'Ident already used!'})

        table.insert_one(
            {
                'ident': schedule['ident'],
                'username': username,
                'name': schedule['name'],
                'description': schedule['description'],
                'params': [],
            }
        )

        # return the schedule to approve
        return to_json(schedule)

    elif action == 'delete':
        result = table.delete_one({'ident': schedule['ident'], 'username': username})

    elif action == 'update':
        # encode instagram credentials
        for param in schedule['params']:
            if param['name'] != 'password' and param['name'] != 'username':
                continue

            param['value'] = coding_wrapper(param['value'], encode)

        table.find_one_and_update(
            {'ident': schedule['ident'], 'username': username},
            {'$set': {'params': schedule['params']}},
        )

    elif action == 'edit':
        table.find_one_and_update(
            {'ident': schedule['oldIdent'], 'username': username},
            {
                '$set': {
                    'ident': schedule['ident'],
                    'name': schedule['name'],
                    'description': schedule['description'],
                }
            },
        )

    else:
        return to_json({'error': 'Action not found!'})

    return to_json({'done': True})
