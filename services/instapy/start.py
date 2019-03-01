from os import getenv
import os
# docker.for.mac.localhost -> dev on mac
# docker.for.windows.localhost -> dev on windows
# instapy-socket -> production
# host.docker.internal -> dev 
socket_endpoint = getenv('SOCKET_HOST') or 'instapy-socket'
socket_port = getenv('SOCKET_PORT') or 80

from websocket import create_connection
import json
import sys

socket = create_connection(f'ws://{socket_endpoint}:{socket_port}')
message = {
    'handler': 'namespace',
    'action': 'get'
}

socket.send(json.dumps(message))
res = socket.recv()
socket.close()

res = json.loads(res)

namespace = res['namespace']

# close if no namespace is provided
if not namespace: sys.exit(0)

# start the bot
import logging
from signal import signal, SIGUSR1, SIGINT
from tinydb import where

from instapy import InstaPy, set_workspace
from instapy.util import smart_run

import sys
sys.path.append('../')
from python_shared import db, account_table, job_table, action_table
from python_shared import ASSETS


class my_handler(logging.Handler):
    def init(self):
        self.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter(
            '%(levelname)s [%(asctime)s] [%(username)s]  %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S')
        self.setFormatter(logger_formatter)

    def connect(self):
        self.socket = create_connection(f'ws://{socket_endpoint}:{socket_port}')

    def disconnect(self):
        self.socket.close()

    def emit(self, record):
        message = self.format(record)
        
        try:
            self.connect()
            self.socket.send(json.dumps({
                'handler': 'instapy',
                'message': message
            }))
            self.disconnect()
        except:
            pass


log_handler = my_handler()
log_handler.init()

user = account_table.get(where('type') == 'account')
jobs = job_table.search(where('namespace') == namespace)

# sort the position of jobs
jobs.sort(key = lambda job: int(job['position']))

# convert list to actual arrays
# TODO remove until line if we have a proper list view
actions = action_table.all()


for job in jobs:
    action = next(action for action in actions if action['functionName'] == job['functionName'])

    for param in job['params']:
        act_param = next(act_param for act_param in action['params'] if act_param['name'] == param['name'])

        if act_param['type'] != 'list': continue
        if type(param['value']) is not str: continue
        
        # convert to list
        param['value'] = param['value'].split(',')
# ---------------------------------------------------------------------------

# login credentials
insta_username = user['username']
insta_password = user['password']

# influx db credentials
influx_port = getenv('INFLUXDB_PORT') or 8086
influx_port = int(influx_port)
influxdb_options = {
    'user': getenv('INFLUXDB_USER') or 'instapy',
    'password': getenv('INFLUXDB_PASSWORD') or 'instapysecret',
    'database': getenv('INFLUXDB_DB') or 'instapy',
    'host': getenv('INFLUXDB_HOST') or 'localhost',
    'port': influx_port
}

# set assets folder as a workspace
set_workspace(ASSETS)

# get an InstaPy session!
session = InstaPy(username = insta_username,
                  password = insta_password,
                  headless_browser = True,
                  show_logs = True,
                  log_handler = log_handler,
                  browser_binary_path = '/usr/bin/chromedriver',
                  influxdb = influxdb_options)

# function that will be executed before sig kill, to the browser window closes
def exit_browser(*args):
    session.browser.quit()

signal(SIGUSR1, exit_browser)

with smart_run(session):
    for job in jobs:
        arguments = dict()
        for param in job['params']:
            arguments[param['name']] = param['value']

        getattr(session, job['functionName'])(**arguments)
