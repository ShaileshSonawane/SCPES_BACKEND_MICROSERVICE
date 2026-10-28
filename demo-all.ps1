# SCPES Complete Demo Orchestrator
# Starts backend, validates readiness, and executes the end-to-end presentation walkthrough

$ErrorActionPreference = "Continue"
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }
Set-Location $rootDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SCPES - Microservices Orchestration & Demo             " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start backend
& (Join-Path $rootDir "start-backend.ps1")

# Brief pause for gRPC stubs to register
Start-Sleep -Seconds 3

# 2. Run presentation walkthrough
& (Join-Path $rootDir "demo-walkthrough.ps1")
