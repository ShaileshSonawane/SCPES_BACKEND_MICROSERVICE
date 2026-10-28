@echo off
title SCPES - Stop All Services
color 0C
echo ==========================================================
echo   SCPES - Stopping All Microservices and Processes
echo ==========================================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File .\stop-backend.ps1

echo.
echo Stopping Frontend dev server if running...
taskkill /F /IM node.exe /T 2>nul

echo.
echo [OK] All SCPES services stopped.
pause
