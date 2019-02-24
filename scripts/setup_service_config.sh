#!/bin/sh

apk add gcc
apk add musl-dev

# python packages
pip3 install -r services/req_config.txt
