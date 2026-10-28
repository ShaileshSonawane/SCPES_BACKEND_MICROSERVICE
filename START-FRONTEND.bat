@echo off
title SCPES - Frontend Only Launcher
color 0A
cd /d "%~dp0frontend"
echo Starting Vite dev server on http://localhost:5173...
start http://localhost:5173
npm run dev
