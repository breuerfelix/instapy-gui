@echo off
set BASE_URL="https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy"
curl -LJO %BASE_URL%/bot.py
curl -LJO %BASE_URL%/start.py
curl -LJO %BASE_URL%/requirements.txt
curl -LJO %BASE_URL%/setup.bat