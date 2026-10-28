@echo off
title SCPES - Full Presentation Launcher
color 0B
echo ==========================================================
echo   SCPES - Smart College Placement Eligibility System
echo   Turnkey Demo and Presentation Launcher
echo ==========================================================
echo.

cd /d "%~dp0"

echo [1/4] Ensuring Docker Desktop and Infrastructure are running...
start "" "C:\Users\Shailesh\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"
timeout /t 5 /nobreak >nul

docker compose up -d postgres kafka
echo [OK] PostgreSQL and Kafka containers activated.
echo.

echo [2/4] Starting Microservices in Presentation Windows...
powershell -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -WorkingDirectory '%~dp0' -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', '.\start-backend.ps1', '-CoreOnly', '-InteractiveWindows'"
echo [OK] Microservices launched in dedicated console windows.
echo.

echo [3/4] Starting Vite Frontend UI (Port 5173)...
start "SCPES Frontend" /d "%~dp0frontend" cmd /k "npm run dev"
echo [OK] Frontend server booting on http://localhost:5173...
echo.

echo [4/4] Opening Web Application in Browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173
echo.
echo ==========================================================
echo   SCPES IS LIVE AND READY FOR YOUR TEACHERS!
echo   Frontend URL:   http://localhost:5173
echo   API Gateway:    http://localhost:8080
echo   To run CLI test: Double click DEMO-WALKTHROUGH.bat
echo   To stop all:     Double click STOP-ALL.bat
echo ==========================================================
pause
