#! /bin/bash

npm install
pip3 install -r requirements.txt
pip3 install -I https://github.com/timgrossmann/InstaPy/zipball/signature-types
cd services && python3 get_actions.py && python3 config_service.py