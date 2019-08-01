from pymongo import MongoClient
from os import getenv

url = getenv('MONGO_URL') or 'mongodb://instapy:instapysecret@mongo:27017'
client = MongoClient(url)

userdb_name = getenv('MONGO_USER_DB') or 'user'
