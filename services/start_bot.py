import sys
from instapy import InstaPy
from instapy.util import smart_run

from config import db
from tinydb import where


if __name__ == '__main__':

    namespace = 'quickstart-follow-hashtag'

    user = db.get(where('type') == 'account')
    jobs = db.search(
        (where('type') == 'job') &
        (where('namespace') == namespace)
    )

    jobs.sort(key = lambda job: int(job['position']))

    # login credentials
    insta_username = user['username']
    insta_password = user['password']

    # get an InstaPy session!
    # set headless_browser=True to run InstaPy in the background
    session = InstaPy(username=insta_username,
                      password=insta_password,
                      headless_browser=True)

    with smart_run(session):
        for job in jobs:
            arguments = dict()
            for param in job['params']:
                arguments[param['name']] = param['value']

            getattr(session, job['functionName'])(**arguments)


