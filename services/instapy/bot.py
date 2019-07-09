import os
import sys
import logging
import requests
import json
import platform
import signal
from os import getenv
from websocket import create_connection
from instapy import InstaPy, set_workspace
from instapy.util import smart_run

namespace = getenv('NAMESPACE')
setting_ident = getenv('SETTING')
token = getenv('TOKEN')
ident = getenv('IDENT')
config_endpoint = getenv('CONFIG')
socket_endpoint = getenv('SOCKET')

if not namespace or not token: sys.exit(0)

headers = {
    'Authorization': f'Bearer {token}'
}

def get(url):
    global headers
    res = requests.get(config_endpoint + url, headers = headers)
    return res.json()

def post(url, data):
    global headers
    res = requests.post(
        config_endpoint + url,
        data = json.dumps(data),
        headers = headers
    )
    return res.json()

class my_handler(logging.Handler):
    def init(self):
        self.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter(
            '%(levelname)s [%(asctime)s] %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S')
        self.setFormatter(logger_formatter)

    def connect(self):
        global token
        global headers
        self.socket = create_connection(socket_endpoint, header = headers)

    def disconnect(self):
        self.socket.close()

    def emit(self, record):
        message = self.format(record)
        global ident

        try:
            self.connect()
            self.socket.send(json.dumps({
                'handler': 'instapy_log',
                'message': message,
                'ident': ident
            }))
            self.disconnect()
        except Exception as e:
            print('error sending log:', e)


log_handler = my_handler()
log_handler.init()

res_jobs = get(f'/namespaces/{namespace}/jobs')

# sort out non active jobs
jobs = []
for job in res_jobs:
    if job['active'] == False: continue
    jobs.append(job)

# TODO remove until line if we have a proper tuple / list view
# update 1.7.19 proper list view added!
# remove when all tuples are removed
# convert list to actual arrays / tuples
actions = get('/actions')

for job in jobs:
    action = next(action for action in actions if action['functionName'] == job['functionName'])

    for param in job['params']:
        act_param = next(act_param for act_param in action['params'] if act_param['name'] == param['name'])

        if not isinstance(param['value'], str): continue

        if act_param['type'] == 'list' or act_param['type'] == 'tuple':
            param['value'] = param['value'].split(',')

        if act_param['type'] == 'tuple':
            param['value'] = tuple(param['value'])
# ---------------------------------------------------------------------------

setting = get(f'/settings/{setting_ident}')

# user args
instapy_args = dict()
for param in setting['params']:
    instapy_args[param['name']] = param['value']

# custom args
instapy_args['log_handler'] = log_handler

# set assets folder as a workspace
ASSETS = os.path.dirname(os.path.abspath(__file__)) + '/assets'
set_workspace(ASSETS)

# get an InstaPy session!
session = InstaPy(**instapy_args)

# function that will be executed before sig kill, to the browser window closes
def exit_browser(*args):
    session.browser.quit()

if platform.system() != 'Windows':
    signal.signal(signal.SIGUSR1, exit_browser)

with smart_run(session):
    for job in jobs:
        arguments = dict()
        for param in job['params']:
            arguments[param['name']] = param['value']

        getattr(session, job['functionName'])(**arguments)
