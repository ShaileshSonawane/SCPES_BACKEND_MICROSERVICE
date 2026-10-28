# SCPES Microservices - Robust Launcher for Windows
param(
    [switch]$InteractiveWindows,
    [switch]$CoreOnly,
    [switch]$NoWait
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SCPES - Smart College Placement Eligibility System     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }
Set-Location $rootDir

# 1. Locate JDK 21
$jdk21 = "C:\Users\Shailesh\.jdks\ms-21.0.12.1"
$javaExe = "$jdk21\bin\java.exe"
if (Test-Path $jdk21) {
    $env:JAVA_HOME = $jdk21
    $env:PATH = "$jdk21\bin;$env:PATH"
}
if (-not (Test-Path $javaExe)) {
    $javaExe = "java"
}
Write-Host "[OK] Using Java binary: $javaExe" -ForegroundColor Green

# 2. Check & start Docker infrastructure
Write-Host "`nChecking infrastructure (PostgreSQL & Kafka)..." -ForegroundColor Cyan
$dockerRunning = $false
try {
    $null = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) { $dockerRunning = $true }
} catch {}

if ($dockerRunning) {
    Write-Host "[OK] Docker is running. Ensuring postgres and kafka containers are up..." -ForegroundColor Green
    docker compose up -d postgres kafka
} else {
    Write-Host "[WARN] Docker Desktop is not active. Make sure PostgreSQL and Kafka are accessible." -ForegroundColor Yellow
}

# 3. Ensure logs directory exists
$logsDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

# 4. Define services
if ($CoreOnly) {
    Write-Host "Mode: [CORE-ONLY] Launching essential presentation services (Gateway, Identity, Student, Placement, Eligibility)" -ForegroundColor Magenta
    $services = @(
        @{ Name = "identity-service";    Port = 8082; Schema = "identity_svc" },
        @{ Name = "student-service";     Port = 8083; Schema = "student_svc" },
        @{ Name = "placement-service";   Port = 8084; Schema = "placement_svc" },
        @{ Name = "eligibility-service"; Port = 8085; Schema = "eligibility_svc" },
        @{ Name = "api-gateway";         Port = 8080; Schema = $null }
    )
} else {
    Write-Host "Mode: [FULL-STACK] Launching all 8 microservices" -ForegroundColor Magenta
    $services = @(
        @{ Name = "identity-service";    Port = 8082; Schema = "identity_svc" },
        @{ Name = "student-service";     Port = 8083; Schema = "student_svc" },
        @{ Name = "placement-service";   Port = 8084; Schema = "placement_svc" },
        @{ Name = "eligibility-service"; Port = 8085; Schema = "eligibility_svc" },
        @{ Name = "matching-service";    Port = 8087; Schema = "matching_svc" },
        @{ Name = "notification-service";Port = 8081; Schema = "notification_svc" },
        @{ Name = "report-service";      Port = 8086; Schema = "report_svc" },
        @{ Name = "api-gateway";         Port = 8080; Schema = $null }
    )
}

Write-Host "`nLaunching Microservices..." -ForegroundColor Cyan

foreach ($s in $services) {
    $name = $s.Name
    $port = $s.Port
    $schema = $s.Schema
    $jarPath = Join-Path $rootDir "services\$name\target\$name-1.0.0.jar"

    if (-not (Test-Path $jarPath)) {
        Write-Host "  [BUILD] Packaging $name..." -ForegroundColor Yellow
        & .\mvnw.cmd -pl "services/$name" package -DskipTests
    }

    # Check if already listening
    $active = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($active) {
        Write-Host "  -> $name is already running on port $port." -ForegroundColor DarkCyan
        continue
    }

    Write-Host "  -> Starting $name (Port $port)..." -ForegroundColor White

    $jvmArgs = @(
        "-Xms128m",
        "-Xmx256m",
        "-Duser.timezone=UTC"
    )

    if ($schema) {
        $jvmArgs += "-Dspring.datasource.url=jdbc:postgresql://localhost:5433/scpes_db?currentSchema=$schema"
    }

    $jvmArgs += "-Dspring.kafka.bootstrap-servers=localhost:29092"
    $jvmArgs += "-jar"
    $jvmArgs += $jarPath

    $stdoutFile = Join-Path $logsDir "$name.log"
    $stderrFile = Join-Path $logsDir "$name.err.log"

    if ($InteractiveWindows) {
        $runScript = Join-Path $rootDir "run-service.ps1"
        $cmd = "& '$runScript' -ServiceName '$name' -Port $port"
        Start-Process powershell.exe -WorkingDirectory $rootDir -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $cmd
    } else {
        Start-Process -FilePath $javaExe -ArgumentList $jvmArgs -WorkingDirectory $rootDir -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
    }

    Start-Sleep -Milliseconds 800
}

# 5. Wait for services to become healthy
Write-Host "`nWaiting for services to become available..." -ForegroundColor Cyan
$expectedPorts = $services | ForEach-Object { $_.Port }

$maxWaitSec = 300
$elapsed = 0
$pending = @($expectedPorts)

while ($pending.Count -gt 0 -and $elapsed -lt $maxWaitSec) {
    Start-Sleep -Seconds 3
    $elapsed += 3
    $pending = @($expectedPorts | Where-Object {
        $port = $_
        -not (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
    })
    $readyCount = $expectedPorts.Count - $pending.Count
    Write-Host "  [${elapsed}s] $readyCount of $($expectedPorts.Count) services ready (pending ports: $($pending -join ', '))..." -ForegroundColor DarkGray
}

if ($pending.Count -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "  ALL SELECTED SERVICES ARE RUNNING AND HEALTHY!          " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  API Gateway:      http://localhost:8080" -ForegroundColor Yellow
    Write-Host "  Identity Service: http://localhost:8082" -ForegroundColor Gray
    Write-Host "  Student Service:  http://localhost:8083" -ForegroundColor Gray
    Write-Host "  Placement Service:http://localhost:8084" -ForegroundColor Gray
    Write-Host "  Eligibility Svc:  http://localhost:8085" -ForegroundColor Gray
    if (-not $CoreOnly) {
        Write-Host "  Report Service:   http://localhost:8086" -ForegroundColor Gray
        Write-Host "  Matching Service: http://localhost:8087" -ForegroundColor Gray
        Write-Host "  Notification Svc: http://localhost:8081" -ForegroundColor Gray
    }
    Write-Host "`nRun .\demo-walkthrough.ps1 to verify the full flow!" -ForegroundColor Cyan
    Write-Host "Run .\start-frontend.ps1 to start the React UI." -ForegroundColor Cyan
    Write-Host "Run .\stop-backend.ps1 to stop all microservices." -ForegroundColor DarkGray

    if (-not $NoWait) {
        Write-Host "`n[KEEP-ALIVE] Monitoring microservices. Press Ctrl+C or run stop-backend.ps1 to exit." -ForegroundColor Green
        while ($true) {
            Start-Sleep -Seconds 30
        }
    }
} else {
    Write-Host "`n[WARN] Timeout reached ($maxWaitSec s). Some services did not bind in time: $($pending -join ', ')" -ForegroundColor Yellow
    Write-Host "Check logs in $logsDir for details." -ForegroundColor DarkGray
}
