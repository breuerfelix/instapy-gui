import os
from tinydb import TinyDB, where

from .settings import DATABASE

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
    init_quickstart_follower()
    init_quickstart_hashtag()



def init_quickstart_hashtag():
    namespace_table.insert({
        'ident': 'quickstart-hashtag',
        'name': 'Quickstart interact by Hashtag',
        'description': 'This template likes images from hashtag: #vegan and #wwf.'
    })

    job_table.insert({
        'uuid': '10',
        'position': 0,
        'functionName': 'set_relationship_bounds',
        'namespace': 'quickstart-hashtag',
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
                'value': None
            },
            {
                'position': 3,
                'name': 'min_posts',
                'value': None
            },
            {
                'position': 4,
                'name': 'max_posts',
                'value': None
            },
            {
                'position': 5,
                'name': 'max_followers',
                'value': 10000
            },
            {
                'position': 6,
                'name': 'max_following',
                'value': None
            },
            {
                'position': 7,
                'name': 'min_followers',
                'value': None
            },
            {
                'position': 8,
                'name': 'min_following',
                'value': None
            }
        ]
    })
    
    job_table.insert({
        'uuid': '11',
        'position': 1,
        'functionName': 'set_user_interact',
        'namespace': 'quickstart-hashtag',
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
                'value': 70
            },
            {
                'position': 3,
                'name': 'media',
                'value': None
            }
        ]
    })

    job_table.insert({
        'uuid': '12',
        'position': 2,
        'functionName': 'set_do_like',
        'namespace': 'quickstart-hashtag',
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
                'value': 80
            }
        ]
    })

    job_table.insert({
        'uuid': '13',
        'position': 3,
        'functionName': 'like_by_tags',
        'namespace': 'quickstart-hashtag',
        'active': True,
        'params': [
            {
                'position': 0,
                'name': 'tags',
                'value': 'wwf,vegan'
            },
            {
                'position': 1,
                'name': 'amount',
                'value': 100
            },
            {
                'position': 2,
                'name': 'skip_top_posts',
                'value': True
            },
            {
                'position': 3,
                'name': 'use_smart_hashtags',
                'value': False
            },
            {
                'position': 4,
                'name': 'interact',
                'value': True
            },
            {
                'position': 5,
                'name': 'randomize',
                'value': False
            },
            {
                'position': 6,
                'name': 'media',
                'value': None
            }
        ]
    })


def init_quickstart_follower():
    namespace_table.insert({
        'ident': 'quickstart-basics',
        'name': 'Quickstart interact by Username',
        'description': 'This template likes and follows people which are following therock and barackobama.'
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
        'uuid': '5',
        'position': 5,
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
