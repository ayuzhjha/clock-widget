@echo off
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "ClockWidget" /f
echo  [OK] Clock Widget removed from startup.
pause
