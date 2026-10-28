@echo off
title SCPES - Automated Demo Walkthrough
color 0E
echo ==========================================================
echo   SCPES - 10-Step Automated Verification Walkthrough
echo ==========================================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File .\demo-walkthrough.ps1
echo.
pause
