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
    pass


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
        'functionName': 'set_do_comment',
        'description': 'blabla...',
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'defaultValue': False,
                'optional': True,
                'type': 'boolean',
                'description': 'Enable commenting on media.'
            },
            {
                'position': 1,
                'name': 'percentage',
                'defaultValue': None,
                'optional': False,
                'type': 'integer',
                'description': 'How often the bot should comment on media.'
            }
        ]
    })

    db.insert({
        'type': 'action',
        'functionName': 'set_comments',
        'description': 'blabla...',
        'params': [
            {
                'position': 0,
                'name': 'comments',
                'defaultValue': None,
                'optional': False,
                'type': 'list:string',
                'description': 'Comments which should be done. Add username of the poster with @{}'
            },
            {
                'position': 1,
                'name': 'media',
                'defaultValue': None,
                'optional': True,
                # type will be enum later on
                'type': 'string',
                'description': 'Specify the media for given comments.'
            }
        ]
    })
