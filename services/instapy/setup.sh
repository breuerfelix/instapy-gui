#!/bin/bash
set -e
python3 -m pip install --user --upgrade pip
python3 -m pip install --user virtualenv
python3 -m venv env
./env/bin/pip3 install wheel
./env/bin/pip3 install -r requirements.txt
clear
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
read -p "Enter your instapy.io username: "  username
read -p "Enter your instapy.io password: "  password
read -p "Identifier for this client: "  ident
read -e -p "Workdir: " -i "${SCRIPT_DIR}/assets" workdir
echo INSTAPY_USER=$username >> .env
echo INSTAPY_PASSWORD=$password >> .env
echo IDENT=$ident >> .env
echo WORKDIR=$workdir >> .env
echo Successfully setup instapy.io client.
echo Run 'startClient.sh' to start the client.
