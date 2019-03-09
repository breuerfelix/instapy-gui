from pymongo import MongoClient
from os import getenv

mongo_user = getenv('MONGO_USER') or 'instapy'
mongo_password = getenv('MONGO_PASSWORD') or 'instapysecret'
mongo_host = getenv('MONGO_HOST') or 'mongo'
mongo_port = getenv('MONGO_PORT') or '27017'

client = MongoClient(f'mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}')
