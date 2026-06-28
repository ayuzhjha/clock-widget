@echo off
title Clock Widget - Installer Builder
color 0B
echo.
echo  =============================================
echo   Clock Widget - One-Click Build ^& Install
echo  =============================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found.
    echo  Please install it from https://nodejs.org then re-run this.
    pause
    exit /b 1
)

echo  [1/3] Installing dependencies...
call npm install --save-dev electron electron-builder
if %errorlevel% neq 0 (
    echo  [ERROR] npm install failed.
    pause
    exit /b 1
)

echo.
echo  [2/3] Building installer (no code signing)...

:: Disable ALL code signing - fixes the winCodeSign symlink error
set CSC_IDENTITY_AUTO_DISCOVERY=false
set CSC_LINK=
set WIN_CSC_LINK=
set CSC_KEY_PASSWORD=

call npx electron-builder --win --x64
if %errorlevel% neq 0 (
    echo  [ERROR] Build failed.
    pause
    exit /b 1
)

echo.
echo  [3/3] Launching installer...
for /f "delims=" %%i in ('dir /b /s "dist\*.exe" 2^>nul') do set INSTALLER=%%i
if defined INSTALLER (
    start "" "%INSTALLER%"
    echo  Done! Installer launched.
) else (
    echo  Build complete. Check the dist\ folder for the installer.
)

echo.
pause
