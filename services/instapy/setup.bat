@echo off
ECHO welcome To the easy installation batch file!
ECHO.
ECHO please answer the questions so everything gets set up automatically .
ECHO.
goto check_account

:check_account
set "have_account=n"
set /P have_account="Did you already created an account on instapy.io ? (y/n): "
if %have_account% == y GOTO :instapy.io
if %have_account% == Y GOTO :instapy.io
if %have_account% == n GOTO createAccount
if %have_account% == N GOTO createAccount
GOTO default

:createAccount
cls
start "" https://instapy.io/
ECHO Please create an account in order to start.
ECHO.
ECHO Press enter when finished.
PAUSE
GOTO checkPython

:checkPython
python --version 3>NUL
if errorlevel 1 GOTO InstallPython3
if errorlevel 0 GOTO setupPips
GOTO createEnv

:InstallPython3
cls
start "" https://www.python.org/downloads/windows/
ECHO Python3 not found on your system.
ECHO.
ECHO Check the opened website and install Python3.
ECHO.
ECHO When finished, restart this .bat file.
PAUSE

:setupPips
cls
py -m pip install --upgrade pip
py -m pip install --user virtualenv
goto env

:env
py -m venv env
goto installRequ

:installRequ
.\env\Scripts\pip3.exe install -r requirements.txt
goto createEnv

:instapy.io
cls
ECHO Make sure to use the credentials from instapy.io.
ECHO You can always edit the file (instapy.env)
set "username=username"
set /P username="Enter your instapy.io username: "
set "password=password"
set /P password="Enter your instapy.io password: "
set "ident=anyName"
set /P ident="Identifier for this client: "
SET /P workdir="Workdir for this client:" || SET "workdir=%~dp0assets"
goto checkPython

:createEnv
del "instapy.env" /s /f /q
cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
echo WORKDIR=%workdir% >> instapy.env
GOTO theEnd


:theEnd
echo Successfully setup instapy.io client.
echo Run 'startClient.bat' to start the client.
set "answer=y"
set /P answer="Or you wish to run it now ? (y/n): "
if %answer% == y CALL startClient.bat
if %answer% == n exit
EXIT
