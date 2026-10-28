param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceName,
    [Parameter(Mandatory=$true)]
    [int]$Port
)

$ErrorActionPreference = "Continue"

$jdk21 = "C:\Users\Shailesh\.jdks\ms-21.0.12.1"
if (Test-Path $jdk21) {
    $env:JAVA_HOME = $jdk21
    $env:PATH = "$jdk21\bin;$env:PATH"
}

$host.UI.RawUI.WindowTitle = "SCPES - $ServiceName (:$Port)"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting $ServiceName on port $Port" -ForegroundColor Yellow
Write-Host "  JAVA_HOME: $env:JAVA_HOME" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

# Configure DB connection to Docker PostgreSQL on host port 5433
$schemaMap = @{
    "identity-service"     = "identity_svc"
    "student-service"      = "student_svc"
    "placement-service"    = "placement_svc"
    "eligibility-service"  = "eligibility_svc"
    "matching-service"     = "matching_svc"
    "notification-service" = "notification_svc"
    "report-service"       = "report_svc"
}

$jvmArgs = @(
    "-Xms128m",
    "-Xmx256m",
    "-Duser.timezone=UTC"
)

if ($schemaMap.ContainsKey($ServiceName)) {
    $schema = $schemaMap[$ServiceName]
    $dbUrl = "jdbc:postgresql://localhost:5433/scpes_db?currentSchema=$schema"
    $jvmArgs += "-Dspring.datasource.url=$dbUrl"
    Write-Host "  [CONFIG] DB_URL: $dbUrl" -ForegroundColor DarkGray
}

$jvmArgs += "-Dspring.kafka.bootstrap-servers=localhost:29092"

$jarPath = "services\$ServiceName\target\$ServiceName-1.0.0.jar"
if (Test-Path $jarPath) {
    Write-Host "  [FAST-BOOT] Launching packaged JAR: $jarPath" -ForegroundColor Green
    $jvmArgs += "-jar"
    $jvmArgs += $jarPath
    & java $jvmArgs
} else {
    Write-Host "  Launching via Maven spring-boot:run..." -ForegroundColor Cyan
    & .\mvnw.cmd -pl "services/$ServiceName" spring-boot:run
}
