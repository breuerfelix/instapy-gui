import os
from tinydb import TinyDB, where

from .settings import DATABASE

print('using database: ' + DATABASE)

db = TinyDB(DATABASE)

# tables
cache_size = 0
account_table = db.table('account', cache_size = cache_size)
job_table = db.table('job', cache_size = cache_size)
action_table = db.table('action', cache_size = cache_size)
namespace_table = db.table('namespace', cache_size = cache_size)



def init_db():
    '''Initialize a default Database.'''
    result = namespace_table.all()
    # return if there is data
    if result: return

    # clear tables
    job_table.purge()
    namespace_table.purge()

    # NOTE if you want to add a quickstart template, make sure every job uuid is a unique string which is not used before!
    # add quickstarter templates
    init_quickstart_hashtag()



def init_quickstart_hashtag():
    namespace_table.insert({
        'ident': 'quickstart-basics',
        'name': 'Quickstart for Starters',
        'description': 'This template likes, comments and follows people which are following therock and barackobama.'
    })

    job_table.insert({
        'uuid': '0',
        'position': 0,
        'functionName': 'set_user_interact',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'amount',
                'value': 3
            },
            {
                'position': 1,
                'name': 'randomize',
                'value': True
            },
            {
                'position': 2,
                'name': 'percentage',
                'value': 100
            },
            {
                'position': 3,
                'name': 'media',
                'value': 'Photo'
            }
        ]
    })

    job_table.insert({
        'uuid': '1',
        'position': 1,
        'functionName': 'set_relationship_bounds',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'value': True
            },
            {
                'position': 1,
                'name': 'potency_ratio',
                'value': None
            },
            {
                'position': 2,
                'name': 'delimit_by_numbers',
                'value': True
            },
            {
                'position': 6,
                'name': 'max_followers',
                'value': 3000
            },
            {
                'position': 7,
                'name': 'max_following',
                'value': 900
            },
            {
                'position': 8,
                'name': 'min_followers',
                'value': 50
            },
            {
                'position': 9,
                'name': 'min_following',
                'value': 50
            }
        ]
    })

    job_table.insert({
        'uuid': '2',
        'position': 2,
        'functionName': 'set_simulation',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'value': False
            }
        ]
    })

    job_table.insert({
        'uuid': '3',
        'position': 3,
        'functionName': 'set_do_like',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'value': True
            },
            {
                'position': 1,
                'name': 'percentage',
                'value': 100
            }
        ]
    })

    job_table.insert({
        'uuid': '4',
        'position': 4,
        'functionName': 'set_do_comment',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'value': True
            },
            {
                'position': 1,
                'name': 'percentage',
                'value': 35
            }
        ]
    })

    job_table.insert({
        'uuid': '5',
        'position': 5,
        'functionName': 'set_do_follow',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'enabled',
                'value': True
            },
            {
                'position': 1,
                'name': 'percentage',
                'value': 25
            },
            {
                'position': 2,
                'name': 'times',
                'value': 1
            }
        ]
    })

    job_table.insert({
        'uuid': '6',
        'position': 6,
        'functionName': 'interact_user_followers',
        'namespace': 'quickstart-basics',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'usernames',
                'value': 'therock,barackobama'
            },
            {
                'position': 1,
                'name': 'amount',
                'value': 340
            }
        ]
    })
