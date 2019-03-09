import json
from flask import Blueprint, request
from database import client
from auth import to_json, jwt_req
from pymongo import ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import loads

namespaces = Blueprint('namespaces', __name__)


def get_db(payload):
    return client[payload['database']]


@namespaces.route('/namespaces', methods=['GET'])
@jwt_req
def get_namespaces(payload):
    db = get_db(payload)
    namespaces = db.namespaces.find()
    namespaces = list(namespaces)

    for namespace in namespaces:
        del namespace['jobs']

    return to_json(namespaces)



@namespaces.route('/namespaces', methods=['POST'])
@jwt_req
def update_namespaces(payload):
    body = json.loads(request.data)
    namespace = body['namespace']

    if body['action'] == 'add':
        db = get_db(payload)
        result = db.namespaces.find_one({ 'ident': namespace })

        if result:
            return to_json({
                'error': 'ident already used!'
            })

        db.namespaces.insert_one({
            'ident': namespace['ident'],
            'name': namespace['name'],
            'description': namespace['description'],
            'jobs': []
        })

    # return the given namespace to approve
    return to_json(namespace)



@namespaces.route('/namespaces/<namespace>', methods=['POST'])
@jwt_req
def update_namespace(payload, namespace):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        db = get_db(payload)
        db.namespaces.delete_one({ 'ident': namespace })

        return to_json({ 'done': True })

    return to_json({ 'error': 'action not found' })



@namespaces.route('/namespaces/<namespace>/jobs', methods=['GET'])
@jwt_req
def get_jobs(payload, namespace):
    db = get_db(payload)
    result = db.namespaces.find_one({ 'ident': namespace })

    return to_json(result['jobs'])



@namespaces.route('/namespaces/<namespace>/jobs', methods=['POST'])
@jwt_req
def update_jobs(payload, namespace):
    body = loads(request.data)

    if body['action'] == 'update':
        new_jobs = body['jobs']

        db = get_db(payload)
        result = db.namespaces \
            .find_one_and_update({ 'ident': namespace },
                                 {
                                     '$set': { 'jobs': new_jobs }
                                 }, return_document = ReturnDocument.AFTER)

        result = db.namespaces.find_one({ 'ident': namespace })['jobs']

        return to_json(result)

    if body['action'] == 'add':
        new_job = body['job']
        new_job['_id'] = ObjectId()

        db = get_db(payload)
        result = db.namespaces \
            .find_one_and_update({ 'ident': namespace },
                                 {
                                     '$push': { 'jobs': new_job }
                                 }, return_document = ReturnDocument.AFTER)

        result = db.namespaces.find_one({ 'ident': namespace })['jobs']
        return to_json(result)

    return to_json({ 'error': 'could not find matching action!' })



@namespaces.route('/namespaces/<namespace>/jobs/<uuid>', methods=['POST'])
@jwt_req
def update_job(payload, namespace, uuid):
    body = loads(request.data)
    uuid = ObjectId(uuid)

    if body['action'] == 'delete':
        db = get_db(payload)
        result = db.namespaces \
            .find_one_and_update({ 'ident': namespace },
                                 {
                                     '$pull': { 'jobs': { '_id': uuid } }
                                 }, return_document = ReturnDocument.AFTER)

        result = db.namespaces.find_one({ 'ident': namespace })['jobs']
        return to_json(result)

    if body['action'] == 'update':
        new_job = body['job']

        db = get_db(payload)
        result = db.namespaces \
            .find_one_and_update({ 'ident': namespace, 'jobs._id': uuid },
                                 {
                                     '$set': { 'jobs.$': new_job }
                                 }, return_document = ReturnDocument.AFTER)

        result = db.namespaces.find_one({ 'ident': namespace })['jobs']
        return to_json(result)

    return json.dumps({ 'error': 'could not find matching action!' })

