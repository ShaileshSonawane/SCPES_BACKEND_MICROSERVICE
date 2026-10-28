# SCPES Microservices - Stop Script
Write-Host "Stopping SCPES services..." -ForegroundColor Cyan

$ports = @(8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 9091, 9093, 9094, 9095, 9097, 9098)
$stoppedPids = @()

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            $processId = $c.OwningProcess
            if ($processId -and ($stoppedPids -notcontains $processId)) {
                $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($proc -and $proc.ProcessName -match "java") {
                    Write-Host "  Stopping $($proc.ProcessName) (PID: $processId, Port: $port)..." -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    $stoppedPids += $processId
                }
            }
        }
    }
}

Write-Host "[OK] All running SCPES backend services stopped." -ForegroundColor Green
