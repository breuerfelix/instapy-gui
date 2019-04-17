from os import getenv
import os
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

# if this throws an exception, service will shut down -> thats okay!
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

from instapy import InstaPy, set_workspace
from instapy.util import smart_run

import sys

ASSETS = os.path.dirname(os.path.abspath(__file__))

class my_handler(logging.Handler):
    def init(self):
        self.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter(
            '%(levelname)s [%(asctime)s] %(message)s',
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

# get data from db
from database import client

db_name = getenv('MONGO_USER_DB') or 'user'
db = client[db_name]

user = db.account.find_one()
proxy = db.proxy.find_one()
res_jobs = db.namespaces.find_one({ 'ident': namespace })['jobs']
res_jobs = list(res_jobs)

# sort out non active jobs
jobs = []
for job in res_jobs:
    if job['active'] == False: continue
    jobs.append(job)

# TODO remove until line if we have a proper list view
# convert list to actual arrays
actions = client.general.actions.find()
actions = list(actions)

for job in jobs:
    action = next(action for action in actions if action['functionName'] == job['functionName'])

    for param in job['params']:
        act_param = next(act_param for act_param in action['params'] if act_param['name'] == param['name'])

        if type(param['value']) is not str: continue

        if act_param['type'] == 'list' or act_param['type'] == 'tuple':
            param['value'] = param['value'].split(',')

        if act_param['type'] == 'tuple':
            param['value'] = tuple(param['value'])
# ---------------------------------------------------------------------------
client.close()

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
    'host': getenv('INFLUXDB_HOST') or 'influxdb',
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
                  influxdb = influxdb_options,
                  proxy_address = proxy['host'] or None,
                  proxy_port = int(proxy['port']) if proxy['port'] else None,
                  proxy_username = proxy['username'] or None,
                  proxy_password = proxy['password'] or None)

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
