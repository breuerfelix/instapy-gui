from tinydb import TinyDB, where

db = TinyDB('./config.json')


def init_db():
    '''Initialize a default Database.'''
    # clear the db
    #db.purge()

    init_namespaces()



def init_namespaces():
    db.remove(where('type') == 'namespace')
    db.remove(where('type') == 'job')

    db.insert({
        'type': 'namespace',
        'ident': 'quickstart-follow-hashtag',
        'name': 'Quickstart Follow by Hashtag',
        'description': 'Use this template if you want to follow users based on a given hashtag.'
    })
