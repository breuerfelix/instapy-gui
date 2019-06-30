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

user = get('/login')
proxy = get('/proxy')
if not proxy:
    # set proxy default values
    proxy = {
        'host': None,
        'port': None,
        'username': None,
        'password': None
    }

res_jobs = get(f'/namespaces/{namespace}/jobs')

# sort out non active jobs
jobs = []
for job in res_jobs:
    if job['active'] == False: continue
    jobs.append(job)

# TODO remove until line if we have a proper list view
# convert list to actual arrays
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
ASSETS = os.path.dirname(os.path.abspath(__file__)) + '/assets'
set_workspace(ASSETS)

# get an InstaPy session!
session = InstaPy(username = insta_username,
                  password = insta_password,
                  headless_browser = True,
                  show_logs = True,
                  log_handler = log_handler,
                  #influxdb = influxdb_options,
                  proxy_address = proxy['host'] or None,
                  proxy_port = int(proxy['port']) if proxy['port'] else None,
                  proxy_username = proxy['username'] or None,
                  proxy_password = proxy['password'] or None)

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
