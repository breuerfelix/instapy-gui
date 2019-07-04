@echo off
ECHO Welcome To the easy installation batch file!
ECHO -
ECHO Please answer the questions so everything gets set up automatically .
ECHO -
ECHO (press enter to continue)
PAUSE

cls
set "have_account=n"
set /P have_account="Did you already created an account on instapy.io ? (y/n): "
if %have_account% == y GOTO checkPython
if %have_account% == n GOTO createAccount
GOTO default

:createAccount
cls
start "" https://gui.instapy.io/
ECHO Please create an account in order to start.
ECHO -
ECHO Press enter when finished.
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
ECHO Python3 not found on your system.
ECHO -
ECHO Check the opened website and install Python3.
ECHO -
ECHO When finished, restart this .bat file.
GOTO default

:setup
cls
py -m pip install --upgrade pip
py -m pip install --user virtualenv

cls
set "EnvironmentFolder=env"
set /P EnvironmentFolder="Choose your environment folder name (press enter for default: 'env'): "

py -m venv %EnvironmentFolder%

echo ./%EnvironmentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1
echo ./%EnvironmentFolder%/Scripts/python.exe ./start.py >> StartingClient.ps1

Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1

cls
ECHO Make sure to use the credentials from instapy.io.
ECHO -
set "username=username"
set /P username="instapy.io username: "

ECHO -
set "password=password"
set /P password="instapy.io password: "

ECHO -
set "ident=choose_any_name_to_indentify_this_instance"
set /P ident="Enter any identifier for this client: "

cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
cls

ECHO instapy.env CREATED successfully!
GOTO default

:default
ECHO Setup completed. (press enter to exit)
PAUSE
