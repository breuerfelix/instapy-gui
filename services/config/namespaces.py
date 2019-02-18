import json
from flask import Blueprint, request
from tinydb import where

from config import db

namespaces = Blueprint('namespaces', __name__)


@namespaces.route('/namespaces', methods=['GET'])
def get_namespaces():
    result = db.search(where('type') == 'namespace')
    return json.dumps(result)



@namespaces.route('/namespaces', methods=['POST'])
def update_namespaces():
    body = json.loads(request.data)
    namespace = body['namespace']
    if body['action'] == 'add':
        result = db.search((where('type') == 'namespace') & (where('ident') == namespace['ident']))

        if result:
            return {
                'error': 'Ident already used!'
            }

        db.insert({
            'type': 'namespace',
            'ident': namespace['ident'],
            'name': namespace['name'],
            'description': namespace['description']
        })

    return json.dumps(namespace)



@namespaces.route('/namespaces/<namespace>', methods=['POST'])
def update_namespace(namespace):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        db.remove((where('type') == 'namespace') & (where('ident') == namespace))
        # delete all jobs connected to this namespace
        db.remove((where('type') == 'job') & (where('namespace') == namespace))
        db.all()

        return json.dumps({ 'done': True })



@namespaces.route('/namespaces/<namespace>/jobs', methods=['GET'])
def get_jobs(namespace):
    result = db.search((where('type') == 'job') & (where('namespace') == namespace))
    return json.dumps(result)



@namespaces.route('/namespaces/<namespace>/jobs', methods=['POST'])
def update_jobs(namespace):
    body = json.loads(request.data)

    if body['action'] == 'update':
        new_jobs = body['jobs']
        for new_job in new_jobs:
            db.update(new_job,
                (where('type') == 'job') &
                (where('namespace') == namespace) &
                (where('uuid') == new_job['uuid'])
            )

        # return all saved jobs
        result = db.search((where('type') == 'job') & (where('namespace') == namespace))
        return json.dumps(result)

    if body['action'] == 'add':
        new_job = body['job']
        old_job = db.get(
            (where('type') == 'job') &
            (where('uuid') == new_job['uuid'])
        )

        if old_job:
            return json.dumps({ 'error': 'uuid already in use!' })


        db.insert(new_job)

        # return all saved jobs
        result = db.search(
            (where('type') == 'job') &
            (where('namespace') == namespace)
        )

        return json.dumps(result)

    return json.dumps({ 'error': 'Could not find matching action!' })



@namespaces.route('/namespaces/<namespace>/jobs/<uuid>', methods=['POST'])
def update_job(namespace, uuid):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        # remove single job
        db.remove(
            (where('type') == 'job') &
            (where('namespace') == namespace) &
            (where('uuid') == uuid)
        )
        db.all()

        # update all jobs, because of their new position
        new_jobs = body['jobs']
        for new_job in new_jobs:
            db.update(new_job,
                (where('type') == 'job') &
                (where('namespace') == namespace) &
                (where('uuid') == new_job['uuid'])
            )

        # return all saved jobs
        result = db.search((where('type') == 'job') & (where('namespace') == namespace))
        return json.dumps(result)

    if body['action'] == 'update':
        new_job = body['job']
        job = db.update(new_job,
            (where('type') == 'job') &
            (where('namespace') == namespace) &
            (where('uuid') == uuid)
        )

        return json.dumps(job)


    return json.dumps({ 'error': 'Could not find matching action!' })

