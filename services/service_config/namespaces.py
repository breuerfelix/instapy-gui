import json
from flask import Blueprint, request
from tinydb import where

from src import namespace_table, job_table

namespaces = Blueprint('namespaces', __name__)


@namespaces.route('/namespaces', methods=['GET'])
def get_namespaces():
    result = namespace_table.all()
    return json.dumps(result)



@namespaces.route('/namespaces', methods=['POST'])
def update_namespaces():
    body = json.loads(request.data)
    namespace = body['namespace']
    if body['action'] == 'add':
        result = namespace_table.search(where('ident') == namespace['ident'])

        if result:
            return {
                'error': 'Ident already used!'
            }

        namespace_table.insert({
            'ident': namespace['ident'],
            'name': namespace['name'],
            'description': namespace['description']
        })

    return json.dumps(namespace)



@namespaces.route('/namespaces/<namespace>', methods=['POST'])
def update_namespace(namespace):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        namespace_table.remove(where('ident') == namespace)
        # delete all jobs connected to this namespace
        job_table.remove(where('namespace') == namespace)

        return json.dumps({ 'done': True })



@namespaces.route('/namespaces/<namespace>/jobs', methods=['GET'])
def get_jobs(namespace):
    result = job_table.search(where('namespace') == namespace)
    return json.dumps(result)



@namespaces.route('/namespaces/<namespace>/jobs', methods=['POST'])
def update_jobs(namespace):
    body = json.loads(request.data)

    if body['action'] == 'update':
        new_jobs = body['jobs']
        for new_job in new_jobs:
            job_table.update(new_job,
                (where('namespace') == namespace) &
                (where('uuid') == new_job['uuid'])
            )

        # return all saved jobs
        result = job_table.search(where('namespace') == namespace)
        return json.dumps(result)

    if body['action'] == 'add':
        new_job = body['job']
        old_job = job_table.get(where('uuid') == new_job['uuid'])

        if old_job:
            return json.dumps({ 'error': 'uuid already in use!' })


        job_table.insert(new_job)

        # return all saved jobs
        result = job_table.search(where('namespace') == namespace)

        return json.dumps(result)

    return json.dumps({ 'error': 'Could not find matching action!' })



@namespaces.route('/namespaces/<namespace>/jobs/<uuid>', methods=['POST'])
def update_job(namespace, uuid):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        # remove single job
        job_table.remove(
            (where('namespace') == namespace) &
            (where('uuid') == uuid)
        )

        # update all jobs, because of their new position
        new_jobs = body['jobs']
        for new_job in new_jobs:
            job_table.update(new_job,
                (where('namespace') == namespace) &
                (where('uuid') == new_job['uuid'])
            )

        # return all saved jobs
        result = job_table.search(where('namespace') == namespace)
        return json.dumps(result)

    if body['action'] == 'update':
        new_job = body['job']
        job_table.update(new_job,
            (where('namespace') == namespace) &
            (where('uuid') == uuid)
        )

        # return all saved jobs
        result = job_table.search(where('namespace') == namespace)
        return json.dumps(result)


    return json.dumps({ 'error': 'Could not find matching action!' })

