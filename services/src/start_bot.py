import sys
import logging
import json
import os
import multiprocessing

from functools import wraps
from signal import signal, SIGUSR1, SIGINT
from websocket import create_connection
from tinydb import where

from instapy import InstaPy, set_workspace
from instapy.util import smart_run
from .database import db, account_table, job_table, action_table
from .settings import ASSETS


def threaded(fn):
    """Decorator to run a specific function inside a thread."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        thread = multiprocessing.Process(target = fn, args = args,
                        kwargs = kwargs)
        thread.start()
        return thread
    return wrapper

class my_handler(logging.Handler):
    def init(self):
        self.setLevel(logging.DEBUG)
        logger_formatter = logging.Formatter(
            '%(levelname)s [%(asctime)s] [%(username)s]  %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S')
        self.setFormatter(logger_formatter)

    def connect(self):
        self.socket = create_connection('ws://localhost:3001')

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

class bot_handler:
    bot = None

    def toggle_bot(running, namespace):
        bot_handler.shutdown()

        if running:
            bot_handler.bot = start_bot(namespace)


    def get_status():
        if not bot_handler.bot:
            return {
                'running': False,
                'status': 'stopped'
            }

        alive = bot_handler.bot.is_alive()
        return {
            'running': alive,
            'status': 'running' if alive else 'stopped'
        }


    def shutdown():
        if not bot_handler.bot: return

        os.kill(bot_handler.bot.pid, SIGUSR1)
        os.kill(bot_handler.bot.pid, SIGINT)
        #bot_handler.bot.terminate()
        #bot_handler.bot.join()
        bot_handler.bot = None



@threaded
def start_bot(namespace):
    user = account_table.get(where('type') == 'account')
    jobs = job_table.search(where('namespace') == namespace)

    # sort the position of jobs
    jobs.sort(key = lambda job: int(job['position']))
    
    # convert list to actual arrays
    # TODO remove this if we have a proper list view
    actions = action_table.all()


    for job in jobs:
        action = next(action for action in actions if action['functionName'] == job['functionName'])

        for param in job['params']:
            act_param = next(act_param for act_param in action['params'] if act_param['name'] == param['name'])

            if act_param['type'] != 'list': continue
            
            # convert to list
            param['value'] = param['value'].split(';')



    # login credentials
    insta_username = user['username']
    insta_password = user['password']

    # set assets folder as a workspace
    set_workspace(ASSETS)

    # get an InstaPy session!
    session = InstaPy(username = insta_username,
                      password = insta_password,
                      headless_browser = False,
                      show_logs = True,
                      log_handler = log_handler,
                      browser_binary_path = '/usr/bin/chromedriver')

    # function that will be executed before sig kill, to the browser window closes
    def on_exit(*args):
        print('got user signal')
        session.browser.quit()

    signal(SIGUSR1, on_exit)
    print('got here')

    with smart_run(session):
        for job in jobs:
            arguments = dict()
            for param in job['params']:
                arguments[param['name']] = param['value']

            getattr(session, job['functionName'])(**arguments)
