@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 goto install_node
where npm >nul 2>&1
if errorlevel 1 goto install_node
goto check_node

:install_node
where winget >nul 2>&1
if errorlevel 1 (
    echo Node.js and npm are required. Install Node.js LTS from https://nodejs.org/ and run this file again.
    goto failed
)
echo Installing Node.js LTS with Windows Package Manager...
winget install --id OpenJS.NodeJS.LTS --exact --source winget
if errorlevel 1 (
    echo Node.js installation did not complete. Check the message above.
    goto failed
)

rem The newly installed directory may not be in this command window's PATH yet.
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>&1
if errorlevel 1 (
    echo Open a new Command Prompt and run this file again to refresh PATH.
    goto failed
)
where npm >nul 2>&1
if errorlevel 1 (
    echo Open a new Command Prompt and run this file again to refresh PATH.
    goto failed
)
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)"
if errorlevel 1 (
    echo Node.js 20 or newer is required. Please update Node.js LTS and try again.
    goto failed
)
goto dependencies

:check_node
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)"
if errorlevel 1 goto install_node

:dependencies
echo Installing SAA dependencies...
call npm install
if errorlevel 1 (
    echo npm install failed. Check the message above.
    goto failed
)

echo Starting SAA...
call npm start
if errorlevel 1 goto failed
exit /b 0

:failed
echo.
echo Setup or startup did not complete. Press any key to close this window.
pause >nul
exit /b 1
