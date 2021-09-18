from dotenv import load_dotenv

load_dotenv('.env')
load_dotenv('instapy.env')


import os
import signal
import subprocess
import platform
import sys
import json
import time
import websocket
import requests
import sqlite3
import functools
import inspect
from filelock import FileLock, Timeout

# constants
AUTH_ENDPOINT = os.getenv('AUTH_ENDPOINT', 'https://auth.instapy.io')
CONFIG_ENDPOINT = os.getenv('CONFIG_ENDPOINT', 'https://config.instapy.io')
SOCKET_ENDPOINT = os.getenv('SOCKET_ENDPOINT', 'wss://socket.instapy.io')
ASSETS = os.getenv('WORKDIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets'))
IDENT = os.getenv('IDENT')

DB_PATH = os.path.join(ASSETS, 'InstaPy', 'db', 'instapy.db')
flock = FileLock(os.path.join(ASSETS, 'InstaPy', 'usage.lock'), timeout=0)

db_con = None

if not IDENT:
    print('IDENT not provided')
    sys.exit(1)

try:
    flock.acquire()
except Timeout:
    print("You should not run 2 bots on the same workdir.")
    sys.exit(1)

# globals
PROCESS = None
TOKEN = None
HANDLERS = {}
NAMESPACE = None
SETTING = None
QUERY_GET_ACTIVITIES = '''
            SELECT recActivity.rowid,
                prof.name,
                sum(recActivity.likes) as likes,
                sum(recActivity.comments) as comments,
                sum(recActivity.follows) as follows,
                sum(recActivity.unfollows) as unfollows,
                sum(recActivity.server_calls) as server_calls,
                strftime('%Y-%m-%d', recActivity.created) as day_filter
            FROM recordActivity as recActivity
            LEFT JOIN profiles as prof ON recActivity.profile_id = prof.id
            GROUP BY day_filter, profile_id
            ORDER BY recActivity.created desc'''
QUERY_GET_USER_STATISTRICS = '''
            SELECT accountsProgress.followers,
              accountsProgress.following,
              accountsProgress.total_posts,
              max(accountsProgress.created) as created_at,
              strftime('%Y-%m-%d', accountsProgress.created) as day
      FROM accountsProgress, profiles
      WHERE profiles.name = ?
      GROUP BY day
      ORDER BY accountsProgress.created asc'''

# socket stuff
def on_message(ws, message):
    print('received message:', message)
    data = json.loads(message)
    if data['handler'] not in HANDLERS:
        print('could not locate handler:', data['handler'])
        return

    HANDLERS[data['handler']](ws, data)


def on_error(ws, error):
    print('error:', error)


def on_close(ws, close_status_code, close_msg):
    print('closed socket')
    print('status:', close_status_code)
    print('msg:', close_msg)


def on_open(ws):
    print('opened socket')
    print('goto instapy.io and take off!')
    global IDENT
    ws.send(json.dumps({'handler': 'register', 'type': 'instapy', 'ident': IDENT}))

    data = get_db_data(QUERY_GET_ACTIVITIES)
    if data:
        ws.send(json.dumps({'handler': 'get-activities', 'type': 'instapy', 'ident': IDENT, 'data': data}))


def get_token(username, password):
    payload = {'username': username, 'password': password}

    url = AUTH_ENDPOINT + '/login'
    print(f'authenticate {username} to {url} ...')

    response = requests.post(url, data=payload)
    response = response.json()
    if 'error' in response:
        print(response['error'])
        sys.exit()

    print(f'logged in with user: {username}')
    return response['token']


# utils
def kill():
    global PROCESS
    if not PROCESS:
        return
    if PROCESS.poll() is None:
        print('killing process...')

        if platform.system() == 'Windows':
            PROCESS.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            os.killpg(os.getpgid(PROCESS.pid), signal.SIGTERM)

        print('process killed')

    PROCESS = None


def check_process():
    global PROCESS
    if not PROCESS:
        return
    if PROCESS.poll() is not None:
        kill()


def ensure_db_connected(f):
    @functools.wraps(f)
    def wrapped_function(*args, **kwargs):
        global db_con
        if not db_con:
            try:
                db_con = sqlite3.connect(DB_PATH)
            except sqlite3.OperationalError as e:
                print(f"Could not connect to database {DB_PATH}")
                return

        return f(db_con, *args, **kwargs)

    wrapped_function.__signature__ = inspect.signature(f)
    return wrapped_function

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@ensure_db_connected
def get_db_data(db_con, sql_query, *args):
    cur = db_con.cursor()
    cur.row_factory = dict_factory
    try:
        cur.execute(sql_query, args)
    except sqlite3.OperationalError as e:
        return
    data = cur.fetchall()
    cur.close()
    return data

# handlers
def get_status(ws, data):
    check_process()
    global PROCESS
    global NAMESPACE
    global SETTING

    status = 'running' if PROCESS else 'stopped'

    ws.send(
        json.dumps(
            {
                'handler': 'status',
                'status': status,
                'namespace': NAMESPACE,
                'setting': SETTING,
                'action': 'set',
            }
        )
    )


HANDLERS['status'] = get_status


def start(ws, data):
    check_process()
    global PROCESS
    global TOKEN
    global IDENT
    global NAMESPACE
    global SETTING

    ienv = os.environ.copy()
    ienv['TOKEN'] = TOKEN
    ienv['NAMESPACE'] = data['namespace']
    NAMESPACE = data['namespace']
    ienv['SETTING'] = data['setting']
    SETTING = data['setting']
    ienv['SOCKET'] = SOCKET_ENDPOINT
    ienv['CONFIG'] = CONFIG_ENDPOINT
    ienv['IDENT'] = IDENT
    ienv['ASSETS'] = ASSETS

    if platform.system() == 'Windows':
        PROCESS = subprocess.Popen(
            [sys.executable, 'bot.py'],
            shell=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
            env=ienv,
        )
    else:
        PROCESS = subprocess.Popen(
            [sys.executable, 'bot.py'], preexec_fn=os.setsid, env=ienv
        )

    print('instapy process started')
    get_status(ws, data)


HANDLERS['start'] = start


def stop(ws, data):
    kill()
    get_status(ws, data)


HANDLERS['stop'] = stop

def get_activities(ws, data):
    activities = get_db_data(QUERY_GET_ACTIVITIES)
    if activities:
        ws.send(json.dumps({'handler': 'get-activities', 'type': 'instapy', 'ident': IDENT, 'data': activities, 'uuid':data['uuid']}))

HANDLERS['get-activities'] = get_activities

def get_user_statistics(ws, data):
    statistics = get_db_data(QUERY_GET_USER_STATISTRICS, data['username'])
    if statistics:
        ws.send(json.dumps({'handler': 'get-user-statistics', 'type': 'instapy', 'ident': IDENT, 'data': statistics, 'uuid':data['uuid']}))

HANDLERS['get-user-statistics'] = get_user_statistics


if __name__ == '__main__':
    username = os.getenv('INSTAPY_USER')
    password = os.getenv('INSTAPY_PASSWORD')

    TOKEN = get_token(username, password)
    header = {'Authorization': f'Bearer {TOKEN}'}

    while True:
        try:
            ws = websocket.WebSocketApp(
                SOCKET_ENDPOINT,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close,
                header=header,
            )

            ws.on_open = on_open
            ws.run_forever(ping_interval=30)
            time.sleep(3)

        except KeyboardInterrupt:
            if db_con:
                db_con.close()
            break
