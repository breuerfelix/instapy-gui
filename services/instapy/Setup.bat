@echo off
ECHO welcome To the easy installation batch file!
ECHO #
ECHO please answer the questions so everything gets set up automatically .
ECHO #
PAUSE
goto check_account

:check_account
cls
set "have_account=n"
set /P have_account="Did you already created an account on instapy.io ? (y/n): "
if %have_account% == y GOTO checkPython
if %have_account% == n GOTO createAccount
GOTO default

:createAccount
cls
start "" https://instapy.io/
ECHO Please create an account in order to start.
ECHO #
ECHO Press enter when finished.
PAUSE
GOTO checkPython

:checkPython
cls
python --version 3>NUL
if errorlevel 1 GOTO InstallPython3
if errorlevel 0 GOTO setupPips
GOTO default

:InstallPython3
cls
start "" https://www.python.org/downloads/windows/
ECHO Python3 not found on your system.
ECHO #
ECHO Check the opened website and install Python3.
ECHO #
ECHO When finished, restart this .bat file.
PAUSE

:setupPips
cls
py -m pip install --upgrade pip
py -m pip install --user virtualenv
goto env

:env
set "EnvironmentFolder=env"
cls
set /P EnvironmentFolder="Choose your environment folder name (press enter for default: 'env'): "
py -m venv %EnvironmentFolder%
echo ./%EnvironmentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1

IF EXIST pShellClient.ps1 (
    echo Found pShellClient.ps1
) ELSE (
    echo pShellClient.ps1 missing.
    echo creating powershell file
    echo ./%EnvironmentFolder%/Scripts/python.exe ./start.py >> pShellClient.ps1
)
IF EXIST startingClient.bat (
    echo Found startingClient
) ELSE (
    echo startingClient.bat missing.
    echo creating batch file
    echo @echo off >> startingClient.bat
    echo start "" https://instapy.io/ >> startingClient.bat
    echo Powershell.exe -executionpolicy remotesigned -File  pShellClient.ps1 >> startingClient.bat
)
goto powershell

:powershell
Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1
goto instapy.io

:instapy.io
cls
ECHO Make sure to use the credentials from instapy.io.
set "username=username"
set /P username="instapy.io username: "
set "password=password"
set /P password="instapy.io password: "
set "ident=choose_any_name_to_indentify_this_instance"
set /P ident="Enter any identifier for this client: "
goto createEnv

:createEnv
cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
GOTO deleteNonUsedFiles

:deleteNonUsedFiles
del "RequirementsInstallation.ps1" /s /f /q
echo deleted RequirementsInstallation.ps1!
GOTO theEnd


:theEnd
ECHO instapy.env CREATED successfully!
ECHO Setup completed.
PAUSE
