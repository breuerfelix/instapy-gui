@ECHO OFF

:PowerShell
SET PSScript=%temp%\~tmpDlFile.ps1
ECHO Instapy.io files downloader:
set /P saveLocation="PASTE THE FULL LOCATION WHERE YOU WANT TO SAVE THE FILES(C:\Users\user\Desktop): "
cls
IF EXIST "%PSScript%" DEL /Q /F "%PSScript%"
ECHO [Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls" >> "%PSScript%"
ECHO Invoke-WebRequest "https://raw.githubusercontent.com/breuerfelix/instapy-gui/feature/auth-service/services/instapy/bot.py" -OutFile "%saveLocation%\bot.py" >> "%PSScript%"
ECHO Invoke-WebRequest "https://raw.githubusercontent.com/breuerfelix/instapy-gui/feature/auth-service/services/instapy/start.py" -OutFile "%saveLocation%\start.py" >> "%PSScript%"
ECHO Invoke-WebRequest "https://raw.githubusercontent.com/breuerfelix/instapy-gui/feature/auth-service/services/instapy/requirements.txt" -OutFile "%saveLocation%\requirements.txt" >> "%PSScript%"
ECHO Invoke-WebRequest "https://github.com/breuerfelix/instapy-gui/blob/feature/auth-service/services/instapy/Setup.bat" -OutFile "%saveLocation%\Setup.bat" >> "%PSScript%"
SET PowerShellDir=C:\Windows\System32\WindowsPowerShell\v1.0
CD /D "%PowerShellDir%"
Powershell -ExecutionPolicy Bypass -Command "& '%PSScript%'"
cls
ECHO Downloaded Successfully
PAUSE
