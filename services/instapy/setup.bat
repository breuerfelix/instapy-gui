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
ECHO updated pip
py -m pip install --user virtualenv
ECHO installed virtualenv
goto env

:env
set "EnvironmentFolder=env"
py -m venv %EnvironmentFolder%
ECHO ./%EnvironmentFolder%/Scripts/pip.exe install -r requirements.txt >> RequirementsInstallation.ps1

IF EXIST pShellClient.ps1 (
    ECHO Found pShellClient.ps1
) ELSE (
    ECHO pShellClient.ps1 missing.
    ECHO creating powershell file
    ECHO ./%EnvironmentFolder%/Scripts/python.exe ./start.py >> pShellClient.ps1
)
IF EXIST startingClient.bat (
    ECHO Found startingClient
) ELSE (
    ECHO startingClient.bat missing.
	ECHO.
    ECHO creating batch file
    ECHO @echo off >> startingClient.bat
    ECHO start "" https://instapy.io/ >> startingClient.bat
    ECHO Powershell.exe -executionpolicy remotesigned -File  pShellClient.ps1 >> startingClient.bat
)
goto powershell

:powershell
Powershell.exe -executionpolicy remotesigned -File  RequirementsInstallation.ps1
goto createEnv

:instapy.io
cls
ECHO Make sure to use the credentials from instapy.io.
ECHO You can always edit the file (instapy.env)
set "username=username"
set /P username="instapy.io username: "
set "password=password"
set /P password="instapy.io password: "
set "ident=choose_any_name_to_indentify_this_instance"
set /P ident="Enter any identifier for this client: "
goto checkPython

:createEnv
cls
echo INSTAPY_USER=%username% >> instapy.env
echo INSTAPY_PASSWORD=%password% >> instapy.env
echo IDENT=%ident% >> instapy.env
GOTO deleteNonUsedFiles

:deleteNonUsedFiles
del "RequirementsInstallation.ps1" /s /f /q
GOTO theEnd


:theEnd
ECHO Setup completed.
PAUSE
