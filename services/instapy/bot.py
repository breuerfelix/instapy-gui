import os
import sys
import logging
import random
import requests
import json
import platform
import signal
from os import getenv
from decimal import Decimal
from websocket import create_connection
from instapy import InstaPy, set_workspace
from instapy.util import smart_run

namespace = getenv('NAMESPACE')
setting_ident = getenv('SETTING')
token = getenv('TOKEN')
ident = getenv('IDENT')
config_endpoint = getenv('CONFIG')
socket_endpoint = getenv('SOCKET')

if not namespace or not token:
    sys.exit(0)

headers = {'Authorization': f'Bearer {token}'}


def get(url):
    global headers
    res = requests.get(config_endpoint + url, headers=headers)
    return res.json()


def post(url, data):
    global headers
    res = requests.post(config_endpoint + url, data=json.dumps(data), headers=headers)
    return res.json()


class my_handler(logging.Handler):
    def init(self):
        self.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter(
            '%(levelname)s [%(asctime)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S'
        )
        self.setFormatter(logger_formatter)

    def connect(self):
        global token
        global headers
        self.socket = create_connection(socket_endpoint, header=headers)

    def disconnect(self):
        self.socket.close()

    def emit(self, record):
        message = self.format(record)
        global ident

        try:
            self.connect()
            self.socket.send(
                json.dumps(
                    {'handler': 'instapy_log', 'message': message, 'ident': ident}
                )
            )
            self.disconnect()
        except Exception as e:
            print('error sending log:', e)


log_handler = my_handler()
log_handler.init()

res_jobs = get(f'/namespaces/{namespace}/jobs')

# sort out non active jobs
jobs = []
for job in res_jobs:
    if job['active'] == False:
        continue
    jobs.append(job)

# TODO remove until line if we have a proper tuple / list view
# update 1.7.19 proper list view added!
# remove when all tuples are removed
# convert list to actual arrays / tuples
actions = get('/actions')

def get_number_of_digits_after_point(number):
    return abs(Decimal(str(number)).as_tuple().exponent)

def randomize_int(min_number, max_number):
    return random.randint(min_number, max_number)

def randomize_float(min_number, max_number):
    N = max(get_number_of_digits_after_point(min_number), get_number_of_digits_after_point(max_number))
    N = max(N, 2)
    return round(random.uniform(min_number, max_number), N)

for job in jobs:
    action = next(
        action for action in actions if action['functionName'] == job['functionName']
    )

    for param in job['params']:
        act_param = next(
            act_param
            for act_param in action['params']
            if act_param['name'] == param['name']
        )

        if (act_param['type'] == 'int' or act_param['type'] == 'float') and type(param['value']) is dict:
            randomize_number = randomize_int if act_param['type'] == 'int' else randomize_float
            if param['value']['is_range']:
                param['value'] = randomize_number(param['value']['min'], param['value']['max'])
            else:
                param['value'] = param['value']['single']
            continue

        if not isinstance(param['value'], str):
            continue

        if act_param['type'] == 'list' or act_param['type'] == 'tuple':
            param['value'] = param['value'].split(',')

        if act_param['type'] == 'tuple':
            param['value'] = tuple(param['value'])
# ---------------------------------------------------------------------------

setting = get(f'/settings/{setting_ident}')

# user args
instapy_args = dict()
for param in setting['params']:
    if param['name'] == 'page_delay' or param['name'] == 'proxy_port':
        if type(param['value']) == int: # backward compitability
            instapy_args[param['name']] = param['value']
        elif param['value']['is_range']:
            instapy_args[param['name']] = random.randint(param['value']['min'], param['value']['max'])
        else:
            instapy_args[param['name']] = param['value']['single']
    else:
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
