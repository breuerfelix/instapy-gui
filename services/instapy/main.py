from dotenv import load_dotenv
load_dotenv()

import psutil
import os
import signal
import subprocess
import sys
import json
import time
import websocket
import requests;

# constants
AUTH_ENDPOINT = 'http://localhost:4001';
API_ENDPOINT = 'http://localhost:4002';
SOCKET_ENDPOINT = 'ws://localhost:4005';
IDENT = os.getenv('IDENT')

if not IDENT:
    print('IDENT not provided')
    sys.exit(1)

# globals
PROCESS = None
TOKEN = None
HANDLERS = {}

# socke stuff
def on_message(ws, message):
    print('received message:', message)
    data = json.loads(message)
    if data['handler'] not in HANDLERS:
        print('could not locate handler:', data['handler'])
        return
    
    HANDLERS[data['handler']](ws, data)

def on_error(ws, error):
    print('error:', error)

def on_close(ws):
    print('closed socket')

def on_open(ws):
    print('opened socket')
    global IDENT
    ws.send(json.dumps({
        'handler': 'register',
        'type': 'instapy',
        'ident': IDENT
    }))

def get_token(username, password):
    payload = {
        'username': username,
        'password': password
    }

    response = requests.post(AUTH_ENDPOINT + '/login', data = payload);
    response = response.json()
    if 'error' in response:
        print(response['error'])
        sys.exit()
    
    return response['token']

# utils
def kill():
    global PROCESS
    if not PROCESS: return
    if not PROCESS.poll():
        print('killing process...')
        os.killpg(os.getpgid(PROCESS.pid), signal.SIGTERM)

    PROCESS = None

def check_process():
    global PROCESS
    if not PROCESS: return
    if PROCESS.poll(): kill()

# handlers
def get_status(ws, data):
    check_process()
    global PROCESS
    status = 'running' if PROCESS else 'stopped'

    ws.send(json.dumps({
        'handler': 'status',
        'status': status,
        'action': 'set'
    }))
HANDLERS['status'] = get_status

def start(ws, data):
    check_process()
    global PROCESS
    global TOKEN
    global IDENT

    ienv = os.environ.copy()
    ienv['TOKEN'] = TOKEN
    ienv['NAMESPACE'] = data['namespace']
    ienv['SOCKET'] = SOCKET_ENDPOINT
    ienv['API'] = API_ENDPOINT
    ienv['IDENT'] = IDENT

    PROCESS = subprocess.Popen(
        ['python3', 'start.py'],
        preexec_fn = os.setsid,
        env = ienv
    )
    get_status(ws, data)
HANDLERS['start'] = start

def stop(ws, data):
    kill()
    get_status(ws, data)
HANDLERS['stop'] = stop

if __name__ == '__main__':
    username = os.getenv('USERNAME')
    password = os.getenv('PASSWORD')

    TOKEN = get_token(username, password)
    header = {
        'Authorization': f'Bearer {TOKEN}'
    }

    while True:
        ws = websocket.WebSocketApp(
            SOCKET_ENDPOINT,
            on_message = on_message,
            on_error = on_error,
            on_close = on_close,
            header = header
        )

        ws.on_open = on_open
        ws.run_forever(ping_interval = 30)
        time.sleep(1)