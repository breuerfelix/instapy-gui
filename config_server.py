import json
from tinydb import TinyDB, where
from flask import Flask, request
from flask_cors import CORS


PORT = 3000
app = Flask(__name__)
CORS(app)
db = TinyDB('./config.json')



@app.route('/namespaces', methods=['GET'])
def get_namespaces():
    result = db.search(where('type') == 'namespace')
    return json.dumps(result)



@app.route('/namespaces', methods=['POST'])
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



@app.route('/namespaces/<namespace>', methods=['POST'])
def update_namespace(namespace):
    body = json.loads(request.data)

    if body['action'] == 'delete':
        db.remove((where('type') == 'namespace') & (where('ident') == namespace))
        db.remove((where('type') == 'job') & (where('namespace') == namespace))
        db.all()

        return json.dumps({ 'done': True })



@app.route('/namespaces/<namespace>/jobs', methods=['GET'])
def get_namespace(namespace):
    result = db.search((where('type') == 'job') & (where('namespace') == namespace))
    return json.dumps(result)



def init_db():
    '''Initialize a default Database.'''
    # clear the db
    db.purge()
    db.all()

    init_namespaces()
    init_jobs()

    # only for debug
    init_actions()

def init_jobs():
    db.insert({
        'type': 'job',
        'uuid': '234340898239048',
        'namespace': 'quickstart-follow-hashtag',
        'functioName': 'follow_by_hashtag',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'username',
                'value': 'felix',
            },
            {
                'position': 1,
                'name': 'password',
                'value': 'bla',
            }
        ]
    })


def init_namespaces():
    db.insert({
        'type': 'namespace',
        'ident': 'quickstart-follow-hashtag',
        'name': 'Quickstart Follow by Hashtag',
        'description': 'Use this template if you want to follow users based on a given hashtag.'
    })

def init_actions():
    db.insert({
        'type': 'action',
        'functionName': 'follow_set_something',
        'description': 'this performs the login',
        'params': [
            {
                'position': 0,
                'name': 'username',
                'defaultValue': None,
                'optional': False,
                'type': 'string',
                'description': 'login username'
            }
        ]
    })

    db.insert({
        'type': 'action',
        'functionName': 'follow_by_hashtag',
        'description': 'this performs the login',
        'params': [
            {
                'position': 0,
                'name': 'username',
                'defaultValue': None,
                'optional': False,
                'type': 'string',
                'description': 'login username'
            }
        ]
    })

    db.insert({
        'type': 'action',
        'functionName': 'set_by_hashtag',
        'description': 'this performs the login',
        'params': [
            {
                'position': 0,
                'name': 'username',
                'defaultValue': None,
                'optional': False,
                'type': 'string',
                'description': 'login username'
            }
        ]
    })

    db.insert({
        'type': 'action',
        'functionName': 'interact_by_hashtag',
        'description': 'this performs the login',
        'params': [
            {
                'position': 0,
                'name': 'username',
                'defaultValue': None,
                'optional': False,
                'type': 'string',
                'description': 'login username'
            }
        ]
    })

if __name__ == '__main__':
    print('starting server....')
    #eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
    app.run(debug=True, port=PORT)
    #init_db()
