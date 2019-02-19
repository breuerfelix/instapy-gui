import sys
from instapy import InstaPy
from instapy.util import smart_run

from config import db, account_table, job_table, action_table
from tinydb import where


if __name__ == '__main__':

    namespace = 'quickstart-basics'

    user = account_table.get(where('type') == 'account')
    jobs = job_table.search(where('namespace') == namespace)

    # sort the position of jobs
    jobs.sort(key = lambda job: int(job['position']))
    
    # convert list to actual arrays
    # TODO remove this if we have a proper list view
    actions = action_table.all()


    for job in jobs:
        action = next(action for action in actions if action['functionName'] == job['functionName'])

        for param in job['params']:
            act_param = next(act_param for act_param in action['params'] if act_param['name'] == param['name'])

            if act_param['type'] != 'list': continue
            
            # convert to list
            param['value'] = param['value'].split(';')



    # login credentials
    insta_username = user['username']
    insta_password = user['password']

    insta_username = 'contacting.john.doe'
    insta_password = 'ThisIsJohnDoe'

    # get an InstaPy session!
    # set headless_browser=True to run InstaPy in the background
    session = InstaPy(username = insta_username,
                      password = insta_password,
                      headless_browser = False)

    with smart_run(session):
        for job in jobs:
            arguments = dict()
            for param in job['params']:
                arguments[param['name']] = param['value']

            getattr(session, job['functionName'])(**arguments)


