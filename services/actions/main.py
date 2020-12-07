#!/usr/bin/env python
from dotenv import load_dotenv
load_dotenv()

def fix_jobs_namespaces():
    from bson.json_util import dumps
    from bson.objectid import ObjectId
    import json

    table = client.configuration.namespaces
    namespaces = table.find({})

    counter = 0
    wrong = 0
    for entry in namespaces:
        counter += 1
        print(counter)
        o_id = ObjectId(entry['_id'])
        ident = entry['ident']
        for job in entry['jobs']:
            if job['namespace'] == ident:
                continue

            j_id = ObjectId(job['_id'])
            table.find_one_and_update(
                {'_id': o_id, 'jobs._id': j_id},
                {'$set': {'jobs.$.namespace': ident}},
            )
            wrong += 1

    print('counter:', counter)
    print('wrong:', wrong)

    client.close()


def diff_actions():
    for action in get_actions():
        act = table.find_one({'functionName': action['functionName']})
        for k, v in action.items():
            if act[k] == v:
                continue

            print('diff!:', k)

            if k == 'params':
                for vv in action[k]:
                    for a in act[k]:
                        if a['name'] == vv['name']:
                            if a != vv:
                                print('new', a)
                                print('old', vv)

                            break

from database import client
from insta import get_actions

if __name__ == '__main__':
    table = client.configuration.actions

    # table.create_index('functionName', unique = True, background = True)

    # update actions
    # for action in get_actions():
        # table.replace_one({'functionName': action['functionName']}, action, upsert=True)

    client.close()
    #print('added actions to mongodb')
