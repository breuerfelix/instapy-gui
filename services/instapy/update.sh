#!/bin/bash          
BASE_URL="https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/"
curl ${BASE_URL}bot.py > bot.py
curl ${BASE_URL}start.py > start.py
curl ${BASE_URL}requirements.txt > requirements.txt
curl ${BASE_URL}setup.sh > setup.sh
curl ${BASE_URL}startClient.sh > startClient.sh