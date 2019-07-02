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
set "UserInputPath=env"
set /P UserInputPath="Choose your Enviroment Folder name: "

py -m venv %UserInputPath%
echo ./%UserInputPath%/Scripts/python.exe -m pip install -r requirements.txt >> %UserInputPath%.ps1
cls
Powershell.exe -executionpolicy remotesigned -File  %UserInputPath%.ps1
cls
set "username=username"
set /P UserInputPath="GUI web Username: "

set "password=password"
set /P UserInputPath="GUI Web Password: "

set "Ident=choose_any_name_to_indentify_this_instance"
set /P UserInputPath="Name your IDENT: "
cls
echo INSTAPY_USER=%username% >> %UserInputPath%.env
echo INSTAPY_PASSWORD=%password% >> %UserInputPath%.env
echo IDENT=choose_any_name_to_indentify_this_instance >> %UserInputPath%.env
cls
