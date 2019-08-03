import json
from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
from pymongo import ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import loads
from bson.json_util import dumps

namespaces = Blueprint('namespaces', __name__)


@namespaces.route('/namespaces', methods=['GET'])
@jwt_req
def get_namespaces(payload):
    db = client.configuration

    # TODO do aggregation with project without 'jobs'
    namespaces = db.namespaces.find({'username': payload['username']})
    namespaces = list(namespaces)

    for namespace in namespaces:
        del namespace['jobs']

    return to_json(namespaces)


@namespaces.route('/namespaces', methods=['POST'])
@jwt_req
def update_namespaces(payload):
    username = payload['username']
    body = json.loads(request.data)
    namespace = body['namespace']
    action = body['action']
    db = client.configuration

    if action == 'add':
        result = db.namespaces.find_one({'ident': namespace, 'username': username})

        if result:
            return to_json({'error': 'ident already used!'})

        db.namespaces.insert_one(
            {
                'ident': namespace['ident'],
                'username': username,
                'name': namespace['name'],
                'description': namespace['description'],
                'jobs': [],
            }
        )

    elif action == 'edit':
        db.namespaces.find_one_and_update(
            {'ident': namespace['oldIdent'], 'username': username},
            {
                '$set': {
                    'ident': namespace['ident'],
                    'name': namespace['name'],
                    'description': namespace['description'],
                }
            },
        )

    elif action == 'copy':
        result = db.namespaces.find_one({'ident': namespace, 'username': username})
        if not result:
            return to_json({'error': 'ident not found!'})

        old_namespace = json.loads(dumps(result))
        for job in old_namespace['jobs']:
            job['_id'] = ObjectId()

        new_ident = old_namespace['ident']
        new_name = old_namespace['name']

        counter = 0
        max_counter = 20
        while counter < max_counter:
            counter = counter + 1
            new_ident = new_ident + ' copy'
            new_name = new_name + ' copy'
            result = db.namespaces.find_one({'ident': new_ident, 'username': username})
            if not result:
                break

        if counter == max_counter:
            return to_json({'error': 'Too many copies!'})

        new_namespace = {
            'ident': new_ident,
            'username': username,
            'name': new_name,
            'description': old_namespace['description'],
            'jobs': old_namespace['jobs'],
        }

        db.namespaces.insert_one(new_namespace)
        return to_json(new_namespace)

    # return the given namespace to approve
    return to_json(namespace)


@namespaces.route('/namespaces/<namespace>', methods=['POST'])
@jwt_req
def update_namespace(payload, namespace):
    username = payload['username']
    body = json.loads(request.data)

    if body['action'] == 'delete':
        db = client.configuration
        db.namespaces.delete_one({'ident': namespace, 'username': username})

        return to_json({'done': True})

    return to_json({'error': 'action not found'})


@namespaces.route('/namespaces/<namespace>/jobs', methods=['GET'])
@jwt_req
def get_jobs(payload, namespace):
    username = payload['username']
    db = client.configuration

    result = db.namespaces.find_one({'ident': namespace, 'username': username})

    return to_json(result['jobs'])


@namespaces.route('/namespaces/<namespace>/jobs', methods=['POST'])
@jwt_req
def update_jobs(payload, namespace):
    username = payload['username']
    body = loads(request.data)

    if body['action'] == 'update':
        new_jobs = body['jobs']

        db = client.configuration
        result = db.namespaces.find_one_and_update(
            {'ident': namespace, 'username': username},
            {'$set': {'jobs': new_jobs}},
            return_document=ReturnDocument.AFTER,
        )

        # TODO change this
        # refetch all jobs to the gui can update everything
        result = db.namespaces.find_one({'ident': namespace, 'username': username})[
            'jobs'
        ]

        return to_json(result)

    if body['action'] == 'add':
        new_job = body['job']
        new_job['_id'] = ObjectId()

        db = client.configuration
        result = db.namespaces.find_one_and_update(
            {'ident': namespace, 'username': username},
            {'$push': {'jobs': new_job}},
            return_document=ReturnDocument.AFTER,
        )

        # TODO change this
        # refetch all jobs to the gui can update everything
        result = db.namespaces.find_one({'ident': namespace, 'username': username})[
            'jobs'
        ]

        return to_json(result)

    return to_json({'error': 'could not find matching action!'})


@namespaces.route('/namespaces/<namespace>/jobs/<uuid>', methods=['POST'])
@jwt_req
def update_job(payload, namespace, uuid):
    username = payload['username']
    body = loads(request.data)
    uuid = ObjectId(uuid)

    if body['action'] == 'delete':
        db = client.configuration
        result = db.namespaces.find_one_and_update(
            {'ident': namespace, 'username': username},
            {'$pull': {'jobs': {'_id': uuid}}},
            return_document=ReturnDocument.AFTER,
        )

        # TODO change this
        # refetch all jobs to the gui can update everything
        result = db.namespaces.find_one({'ident': namespace, 'username': username})[
            'jobs'
        ]

        return to_json(result)

    if body['action'] == 'update':
        new_job = body['job']

        db = client.configuration
        result = db.namespaces.find_one_and_update(
            {'ident': namespace, 'username': username, 'jobs._id': uuid},
            {'$set': {'jobs.$': new_job}},
            return_document=ReturnDocument.AFTER,
        )

        # TODO change this
        # refetch all jobs so the gui can update everything
        result = db.namespaces.find_one({'ident': namespace, 'username': username})[
            'jobs'
        ]

        return to_json(result)

    return json.dumps({'error': 'could not find matching action!'})
