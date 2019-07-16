#!/bin/bash
python3 -m pip install --user --upgrade pip
python3 -m pip install --user virtualenv
python3 -m venv env
./env/bin/pip3 install -r requirements.txt
clear
read -p "Enter your instapy.io username: "  username
read -p "Enter your instapy.io password: "  password
read -p "Identifier for this client: "  ident
echo INSTAPY_USER=$username >> .env
echo INSTAPY_PASSWORD=$password >> .env
echo IDENT=$ident >> .env
echo Successfully setup instapy.io client.
echo Run 'startClient.sh' to start the client.
