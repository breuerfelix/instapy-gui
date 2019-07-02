@echo off
python --version 3>NUL
if errorlevel 1 goto InstallPython3
if errorlevel 0 goto setup

:InstallPython3
start "" https://www.python.org/downloads/windows/
ECHO Install Python3
GOTO setup

:setup
start "" https://gui.instapy.io/
py -m pip install --upgrade pip
cls
py -m pip install --user virtualenv
cls
set "EnviromentFolder=env"
set /P EnviromentFolder="Choose your enviroment folder name (press enter for default: 'env'): "
py -m venv %EnviromentFolder%

echo ./%EnviromentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1
echo ./%EnviromentFolder%/Scripts/python.exe ./start.py >> StartingClient.ps1

Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1
set "username=username"
set /P username="instapy.io username: "

set "password=password"
set /P password="instapy.io password: "

set "ident=choose_any_name_to_indentify_this_instance"
set /P ident="Name of this client: "
cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
cls
