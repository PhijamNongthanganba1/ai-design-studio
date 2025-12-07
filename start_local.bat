@echo off
echo ==================================================
echo       AI Design Studio - Local Launcher
echo ==================================================
echo.
echo 1. Opening Application in Browser...
start http://localhost:3001
echo.
echo 2. Starting Local Server...
echo    (If it says "EADDRINUSE", the server is already running!)
echo.
node backend/server.js
echo.
pause
