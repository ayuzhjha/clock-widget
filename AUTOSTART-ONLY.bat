@echo off
:: Adds Clock Widget to Windows startup without building a full installer
:: Run this once from wherever you've placed the clock-widget folder

set SCRIPT_DIR=%~dp0
set NODE_CMD=node "%SCRIPT_DIR%main.js"

:: Check for Electron installed globally
where electron >nul 2>nul
if %errorlevel% equ 0 (
    set RUN_CMD=electron "%SCRIPT_DIR%"
) else (
    :: Use local node_modules electron if present
    if exist "%SCRIPT_DIR%node_modules\.bin\electron.cmd" (
        set RUN_CMD="%SCRIPT_DIR%node_modules\.bin\electron.cmd" "%SCRIPT_DIR%"
    ) else (
        echo [ERROR] Electron not found. Run BUILD.bat first, or: npm install
        pause
        exit /b 1
    )
)

:: Add to HKCU Run key (current user, no admin needed)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" ^
    /v "ClockWidget" ^
    /t REG_SZ ^
    /d "%RUN_CMD%" ^
    /f

echo.
echo  [OK] Clock Widget added to startup!
echo  It will launch automatically when you log in.
echo.
echo  To remove: run REMOVE-AUTOSTART.bat
echo.
pause
