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



def init_quickstart_hashtag(collection):
    collection.insert({
        'ident': 'quickstart-basics',
        'name': 'Quickstart for Starters',
        'description': 'This template likes, comments and follows people which are following therock and barackobama.',
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
                    },
                    {
                        'name': 'media',
                        'value': 'Photo'
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
                        'name': 'potency_ratio',
                        'value': None
                    },
                    {
                        'name': 'delimit_by_numbers',
                        'value': True
                    },
                    {
                        'name': 'max_followers',
                        'value': 3000
                    },
                    {
                        'name': 'max_following',
                        'value': 900
                    },
                    {
                        'name': 'min_followers',
                        'value': 50
                    },
                    {
                        'name': 'min_following',
                        'value': 50
                    }
                ]
            }
        ]
    })
