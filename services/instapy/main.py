from dotenv import load_dotenv
load_dotenv()

import os
import signal
import subprocess
import sys
import json
import websocket
import requests;

AUTH_ENDPOINT = 'http://localhost:4001';
SOCKET_ENDPOINT = 'ws://localhost:4005';
PROCESS = None
TOKEN = None
HANDLERS = {}

#PROCESS = subprocess.Popen(['python3', 'test.py'], preexec_fn=os.setsid)
#os.killpg(os.getpgid(PROCESS.pid), signal.SIGTERM)

# main stuff
def on_message(ws, message):
    print('received message')
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
    ws.send(json.dumps({
        'handler': 'register',
        'type': 'instapy'
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

# handlers
def get_status():
    pass
HANDLERS['status'] = get_status


if __name__ == '__main__':
    username = os.getenv('USERNAME')
    password = os.getenv('PASSWORD')

    TOKEN = get_token(username, password)
    header = {
        'Authorization': 'Bearer ' + TOKEN
    }

    ws = websocket.WebSocketApp(
        SOCKET_ENDPOINT,
        on_message = on_message,
        on_error = on_error,
        on_close = on_close,
        header = header
    )

    ws.on_open = on_open
    ws.run_forever()