import os
from os import getenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(BASE_DIR, 'assets')
DATABASE = os.path.join(ASSETS, 'config.json')
