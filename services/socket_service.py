#!/usr/bin/env python

import json
import asyncio
import websockets

from src import bot_handler

PORT = 3001

USERS = set()
HANDLERS = set()

def add_handler(func):
    HANDLERS.add(func)


def remove_handler(func):
    HANDLERS.remove(func)


async def send(data):
    if not USERS: return

    try:
        print('send data:')
        print(json.dumps(data))
        await asyncio.wait([user.send(json.dumps(data)) for user in USERS])
    except:
        print('error sending message: ' + json.dumps(data))


def register(websocket):
    USERS.add(websocket)


def unregister(websocket):
    USERS.remove(websocket)


async def listener(websocket, path):
    register(websocket)

    try:
        # initial send on connection
        async for message in websocket:
            data = None

            try:
                data = json.loads(message)
            except:
                print('error loading json')

            if data:
                print('got data:')
                print(json.dumps(data))
                # notify all handlers
                for handler in HANDLERS:
                    await handler(data)

    except Exception as e:
        print('error recieving message')
        print(str(e))
    finally:
        unregister(websocket)


async def start_bot_handler(data):
    if data['handler'] != 'bot_state': return

    if data['action'] == 'toggle':
        running = data['running']
        bot_handler.toggle_bot(running, data['namespace'])
        return

    if data['action'] == 'get':
        status = bot_handler.get_status()
        await send({
            'handler': 'bot_state',
            'action': 'set',
            'running': status['running'],
            'status': status['status']
        })
        return


async def send_logs_handler(data):
    if data['handler'] != 'instapy': return

    await send({
        'handler': 'logger',
        'message': data['message']
    })


if __name__ == '__main__':
    add_handler(start_bot_handler)
    add_handler(send_logs_handler)

    asyncio.get_event_loop().run_until_complete(
        websockets.serve(listener, '', PORT)
    )

    asyncio.get_event_loop().run_forever()
