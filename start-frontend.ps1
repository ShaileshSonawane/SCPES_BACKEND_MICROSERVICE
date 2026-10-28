# SCPES Frontend Launcher
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting SCPES React Frontend (Vite)                   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$frontendDir = Join-Path $PSScriptRoot "frontend"
Set-Location $frontendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host "Starting Vite development server on http://localhost:5173..." -ForegroundColor Green
npm run dev
