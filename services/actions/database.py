from pymongo import MongoClient
from os import getenv

url = getenv('MONGO_URL') or 'mongodb://localhost:27017'

client = MongoClient(url)


def init_db():
    db = client['configuration']

    # create index
    # db.templates.create_index('ident', unique = True, background = True)

    init_quickstart_hashtag(db.templates)
    init_quickstart_follower(db.templates)


def init_quickstart_hashtag(collection):
    collection.insert(
        {
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
                        {'name': 'amount', 'value': 3},
                        {'name': 'randomize', 'value': True},
                        {'name': 'percentage', 'value': 70},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_relationship_bounds',
                    'namespace': 'quickstart-hashtag',
                    'active': True,
                    'params': [
                        {'name': 'enabled', 'value': True},
                        {'name': 'max_followers', 'value': 10000},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_do_like',
                    'namespace': 'quickstart-hashtag',
                    'active': True,
                    'params': [
                        {'name': 'enabled', 'value': True},
                        {'name': 'percentage', 'value': 80},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'like_by_tags',
                    'namespace': 'quickstart-hashtag',
                    'active': True,
                    'params': [
                        {'name': 'tags', 'value': 'wwf,vegan'},
                        {'name': 'amount', 'value': 100},
                        {'name': 'skip_top_posts', 'value': True},
                        {'name': 'interact', 'value': True},
                    ],
                },
            ],
        }
    )


def init_quickstart_follower(collection):
    collection.insert(
        {
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
                        {'name': 'amount', 'value': 3},
                        {'name': 'randomize', 'value': True},
                        {'name': 'percentage', 'value': 100},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_relationship_bounds',
                    'namespace': 'quickstart-basics',
                    'active': True,
                    'params': [
                        {'name': 'enabled', 'value': True},
                        {'name': 'max_followers', 'value': 3000},
                        {'name': 'max_following', 'value': 900},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_simulation',
                    'namespace': 'quickstart-basics',
                    'active': True,
                    'params': [{'name': 'enabled', 'value': False}],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_do_like',
                    'namespace': 'quickstart-basics',
                    'active': True,
                    'params': [
                        {'name': 'enabled', 'value': True},
                        {'name': 'percentage', 'value': 100},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'set_do_follow',
                    'namespace': 'quickstart-basics',
                    'active': True,
                    'params': [
                        {'name': 'enabled', 'value': True},
                        {'name': 'percentage', 'value': 25},
                        {'name': 'times', 'value': 1},
                    ],
                },
                {
                    '_id': ObjectId(),
                    'functionName': 'interact_user_followers',
                    'namespace': 'quickstart-basics',
                    'active': True,
                    'params': [
                        {'name': 'usernames', 'value': 'therock,barackobama'},
                        {'name': 'amount', 'value': 340},
                    ],
                },
            ],
        }
    )
