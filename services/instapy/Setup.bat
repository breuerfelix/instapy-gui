@echo off
ECHO Welcome To the Easy Installation batch file!
ECHO -
ECHO Please Answer the questions in order to setup everything for you.
ECHO -
PAUSE

cls
ECHO Did you already created an account on instapy.io ?
ECHO -
set "have_account=n"
set /P have_account="Type y or n: "
if %have_account% == y GOTO checkPython
if %have_account% == n GOTO createAccount
GOTO default

:createAccount
cls
start "" https://gui.instapy.io/
ECHO Please Create an account , you will use it here.
ECHO -
ECHO Press Enter after creating your account.
PAUSE
GOTO checkPython

:checkPython
cls
python --version 3>NUL
if errorlevel 1 GOTO InstallPython3
if errorlevel 0 GOTO setup
GOTO default

:InstallPython3
cls
start "" https://www.python.org/downloads/windows/
ECHO Check the opened address and Install Python3
ECHO -
ECHO Double click again on Setup.bat
GOTO default

:setup
cls
py -m pip install --upgrade pip
py -m pip install --user virtualenv

cls
set "EnvironmentFolder=env"
set /P EnvironmentFolder="Choose your Environment folder name (press enter for default: 'env'): "

py -m venv %EnvironmentFolder%

echo ./%EnvironmentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1
echo ./%EnvironmentFolder%/Scripts/python.exe ./start.py >> StartingClient.ps1

Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1

cls
ECHO Make sure you use the credentials from Instapy.io
ECHO -
set "username=username"
set /P username="instapy.io username: "

ECHO -
set "password=password"
set /P password="instapy.io password: "

ECHO -
set "ident=choose_any_name_to_indentify_this_instance"
set /P ident="Name of this client: "

cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
cls

ECHO instapy.env CREATED Successfully!

:default
ECHO Setup is Completed
PAUSE