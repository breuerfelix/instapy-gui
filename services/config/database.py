from tinydb import TinyDB, where

db = TinyDB('./config.json')


def init_db():
    '''Initialize a default Database.'''
    # clear the db
    db.purge()

    init_namespaces()
    init_jobs()

    # only for debug
    init_actions()

def init_jobs():
    db.insert({
        'type': 'job',
        'uuid': '234340898239048',
        'position': 1,
        'namespace': 'quickstart-follow-hashtag',
        'functionName': 'follow_by_hashtag',
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

    db.insert({
        'type': 'job',
        'uuid': '23434239048',
        'position': 0,
        'namespace': 'quickstart-follow-hashtag',
        'functionName': 'set_by_hashtag',
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
