from tinydb import TinyDB, where

db = TinyDB('./config.json')

# tables
cache_size = 30
account_table = db.table('account', cache_size = cache_size)
job_table = db.table('job', cache_size = cache_size)
action_table = db.table('action', cache_size = cache_size)
namespace_table = db.table('namespace', cache_size = cache_size)



def init_db():
    '''Initialize a default Database.'''
    # clear the db
    #db.purge()
    result = namespace_table.all()

    # return if there is data
    #if result: return

    # clear tables
    job_table.purge()
    namespace_table.purge()

    # add quickstarter templates
    init_quickstart_hashtag()



def init_quickstart_hashtag():
    namespace_table.insert({
        'ident': 'quickstart-basics',
        'name': 'Quickstart for Starters',
        'description': 'Use this template if you want to follow users based on a given hashtag.'
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
