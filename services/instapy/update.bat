@echo off
WHERE curl >nul 2>nul
IF %ERRORLEVEL% NEQ 1 GOTO curlDownloader
IF %ERRORLEVEL% NEQ 0 GOTO checkForPS1
PAUSE

:curlDownloader
set BASE_URL="https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy"
curl -LJO %BASE_URL%/bot.py
curl -LJO %BASE_URL%/start.py
curl -LJO %BASE_URL%/requirements.txt
curl -LJO %BASE_URL%/setup.bat
curl -LJO %BASE_URL%/startClient.bat

:checkForPS1
if exist easyDownloader.ps1 (
    PowerShell.exe -NoProfile -Command "& {Start-Process PowerShell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""easyDownloader.ps1""' -Verb RunAs}"
    Powershell.exe -executionpolicy remotesigned -File  easyDownloader.ps1
) else (
    goto createPowerShell
)

:createPowerShell
ECHO $urlBot = "https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/bot.py" >> easyDownloader.ps1
ECHO $urlStart = "https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/start.py" >> easyDownloader.ps1
ECHO $urlRequ = "https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/requirements.txt" >> easyDownloader.ps1
ECHO $urlSetup = "https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/setup.bat" >> easyDownloader.ps1
ECHO $urlStartclient = "https://raw.githubusercontent.com/breuerfelix/instapy-gui/master/services/instapy/startClient.bat" >> easyDownloader.ps1
ECHO $outputBot = "$PSScriptRoot\bot.py" >> easyDownloader.ps1
ECHO $outputStart = "$PSScriptRoot\start.py" >> easyDownloader.ps1
ECHO $outputRequ = "$PSScriptRoot\requirements.txt" >> easyDownloader.ps1
ECHO $outputSetup = "$PSScriptRoot\setup.bat" >> easyDownloader.ps1
ECHO $outputStartClient = "$PSScriptRoot\startClient.bat" >> easyDownloader.ps1
ECHO $start_time = Get-Date >> easyDownloader.ps1
ECHO if((Test-Path $outputBot) -and (Test-Path $outputStart) -and (Test-Path $outputRequ) -and (Test-Path $outputSetup)) >> easyDownloader.ps1
ECHO { >> easyDownloader.ps1
ECHO     Write-Host "Deleting old files..." >> easyDownloader.ps1
ECHO     Remove-Item $outputBot >> easyDownloader.ps1
ECHO     Remove-Item $outputStart >> easyDownloader.ps1
ECHO     Remove-Item $outputRequ >> easyDownloader.ps1
ECHO     Remove-Item $outputSetup >> easyDownloader.ps1
ECHO     Remove-Item $outputStartClient >> easyDownloader.ps1
ECHO     Write-Host "All files deleted." >> easyDownloader.ps1
ECHO     Start-Sleep -s 1 >> easyDownloader.ps1
ECHO } >> easyDownloader.ps1
ECHO if(!(Test-Path $outputBot) -and !(Test-Path $outputStart) -and !(Test-Path $outputRequ) -and !(Test-Path $outputSetup)) >> easyDownloader.ps1
ECHO { >> easyDownloader.ps1
ECHO     Write-Host "Updating new files." >> easyDownloader.ps1
ECHO     [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 >> easyDownloader.ps1
ECHO     Invoke-WebRequest -Uri $urlBot -OutFile $outputBot >> easyDownloader.ps1
ECHO     Invoke-WebRequest -Uri $urlStart -OutFile $outputStart >> easyDownloader.ps1
ECHO     Invoke-WebRequest -Uri $urlRequ -OutFile $outputRequ >> easyDownloader.ps1
ECHO     Invoke-WebRequest -Uri $urlSetup -OutFile $outputSetup >> easyDownloader.ps1
ECHO     Invoke-WebRequest -Uri $urlStartClient -OutFile $outputStartClient >> easyDownloader.ps1
ECHO     Write-Host "All files up to date." >> easyDownloader.ps1
ECHO } >> easyDownloader.ps1
ECHO Write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)" >> easyDownloader.ps1
ECHO Start-Sleep -s 3 >> easyDownloader.ps1
PowerShell.exe -NoProfile -Command "& {Start-Process PowerShell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""easyDownloader.ps1""' -Verb RunAs}"
Powershell.exe -executionpolicy remotesigned -File  easyDownloader.ps1
goto next

:next
set "gotoSetup=y"
set /P gotoSetup="Do you wish to run setup.bat ? (y/n): "
if %gotoSetup% == y CALL setup.bat
if %gotoSetup% == n exit