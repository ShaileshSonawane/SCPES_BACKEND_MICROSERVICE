$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$env:PGPASSWORD = "postgres"
$out = & $psql -U postgres -p 5432 -h localhost -c "\l" 2>&1
Write-Host "Output: $out"
