from pymongo import MongoClient
from os import getenv
from bson.objectid import ObjectId

mongo_user = getenv('MONGO_USER') or 'instapy'
mongo_password = getenv('MONGO_PASSWORD') or 'instapysecret'
mongo_host = getenv('MONGO_HOST') or 'mongo'
mongo_port = getenv('MONGO_PORT') or '27017'

client = MongoClient(f'mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}')

userdb_name = getenv('MONGO_USER_DB') or 'user'

def init_db():
    db = client[userdb_name]
    count = db.namespaces.count_documents({})

    # return if there are already namespaces
    if count > 0: return

    # create index
    db.namespaces.create_index('ident', unique = True, background = True)

    # delete all
    db.namespaces.delete_many({})

    init_quickstart_hashtag(db.namespaces)
    init_quickstart_follower(db.namespaces)



def init_quickstart_hashtag(collection):
    collection.insert({
        'ident': 'quickstart-hashtag',
        'name': 'Like - #wwf / #vegan',
        'description': 'This templates likes images from hashtags: #vegan and #wwf.',
        'jobs': [
            {
                '_id': ObjectId(),
                'functionName': 'set_user_interact',
                'namespace': 'quickstart-hashtag',
                'active': True,
                'params': [
                    {
                        'name': 'amount',
                        'value': 3
                    },
                    {
                        'name': 'randomize',
                        'value': True
                    },
                    {
                        'name': 'percentage',
                        'value': 70
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_relationship_bounds',
                'namespace': 'quickstart-hashtag',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': True
                    },
                    {
                        'name': 'max_followers',
                        'value': 10000
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_do_like',
                'namespace': 'quickstart-hashtag',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': True
                    },
                    {
                        'name': 'percentage',
                        'value': 80
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'like_by_tags',
                'namespace': 'quickstart-hashtag',
                'active': True,
                'params': [
                    {
                        'name': 'tags',
                        'value': 'wwf,vegan'
                    },
                    {
                        'name': 'amount',
                        'value': 100
                    },
                    {
                        'name': 'skip_top_posts',
                        'value': True
                    },
                    {
                        'name': 'interact',
                        'value': True
                    }
                ]
            }
        ]
    })



def init_quickstart_follower(collection):
    collection.insert({
        'ident': 'quickstart-basics',
        'name': 'Like and Follow - therock / barackobama',
        'description': 'This template likes and follows people which are following therock and barackobama.',
        'jobs': [
            {
                '_id': ObjectId(),
                'functionName': 'set_user_interact',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'amount',
                        'value': 3
                    },
                    {
                        'name': 'randomize',
                        'value': True
                    },
                    {
                        'name': 'percentage',
                        'value': 100
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_relationship_bounds',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': True
                    },
                    {
                        'name': 'max_followers',
                        'value': 3000
                    },
                    {
                        'name': 'max_following',
                        'value': 900
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_simulation',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': False
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_do_like',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': True
                    },
                    {
                        'name': 'percentage',
                        'value': 100
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'set_do_follow',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'enabled',
                        'value': True
                    },
                    {
                        'name': 'percentage',
                        'value': 25
                    },
                    {
                        'name': 'times',
                        'value': 1
                    }
                ]
            },
            {
                '_id': ObjectId(),
                'functionName': 'interact_user_followers',
                'namespace': 'quickstart-basics',
                'active': True,
                'params': [
                    {
                        'name': 'usernames',
                        'value': 'therock,barackobama'
                    },
                    {
                        'name': 'amount',
                        'value': 340
                    }
                ]
            }
        ]
    })
