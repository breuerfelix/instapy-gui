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
set /P EnviromentFolder="Choose your Enviroment Folder name: "
py -m venv %EnviromentFolder%

echo ./%EnviromentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1
echo ./%EnviromentFolder%/Scripts/python.exe ./start.py >> StartingProject.ps1

Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1
set "username=username"
set /P username="GUI web Username: "

set "password=password"
set /P password="GUI Web Password: "

set "Ident=choose_any_name_to_indentify_this_instance"
set /P Ident="Name your IDENT: "
cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%Ident% >> instapy.env
cls