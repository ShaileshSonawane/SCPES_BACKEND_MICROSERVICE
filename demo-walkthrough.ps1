# SCPES End-to-End Presentation Walkthrough Script
# Tests all Gateway routes and prints clear verification steps

$ErrorActionPreference = "Continue"
$gateway = "http://localhost:8080"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SCPES - End-to-End Presentation Walkthrough            " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login TPO
Write-Host "`n[Step 1] Logging in as TPO (tpo@scpes.edu)..." -ForegroundColor Cyan
$tpoBody = @{ email = "tpo@scpes.edu"; password = "Tpo@123" } | ConvertTo-Json
$tpoAuth = Invoke-RestMethod -Uri "$gateway/auth/login" -Method Post -Body $tpoBody -ContentType "application/json"
$tpoToken = $tpoAuth.accessToken
Write-Host "  [OK] Logged in. Token received (Role: TPO)" -ForegroundColor Green

# 2. Login Student 1 (Aarav - Eligible)
Write-Host "`n[Step 2] Logging in as Student 1 (student1@scpes.edu - Aarav Sharma)..." -ForegroundColor Cyan
$s1Body = @{ email = "student1@scpes.edu"; password = "Student@123" } | ConvertTo-Json
$s1Auth = Invoke-RestMethod -Uri "$gateway/auth/login" -Method Post -Body $s1Body -ContentType "application/json"
$s1Token = $s1Auth.accessToken
Write-Host "  [OK] Logged in as Student 1" -ForegroundColor Green

# 3. Login Student 2 (Neha - Ineligible)
Write-Host "`n[Step 3] Logging in as Student 2 (student2@scpes.edu - Neha Patel)..." -ForegroundColor Cyan
$s2Body = @{ email = "student2@scpes.edu"; password = "Student@123" } | ConvertTo-Json
$s2Auth = Invoke-RestMethod -Uri "$gateway/auth/login" -Method Post -Body $s2Body -ContentType "application/json"
$s2Token = $s2Auth.accessToken
Write-Host "  [OK] Logged in as Student 2" -ForegroundColor Green

# 4. Fetch Drives
Write-Host "`n[Step 4] Viewing Available Placement Drives..." -ForegroundColor Cyan
$drives = Invoke-RestMethod -Uri "$gateway/drives" -Method Get -Headers @{ Authorization = "Bearer $tpoToken" }
$googleDrive = $drives | Where-Object { $_.companyName -match "Google" } | Select-Object -First 1
if (-not $googleDrive) { $googleDrive = $drives[0] }
Write-Host "  [OK] Found $($drives.Count) drives. Selected Drive: $($googleDrive.companyName) - $($googleDrive.role) (CTC: ₹$($googleDrive.ctc) LPA)" -ForegroundColor Green

# 5. Set Eligibility Rules
Write-Host "`n[Step 5] TPO Sets Eligibility Criteria Rules (Min CGPA: 7.0, Max Backlogs: 0, Branch: CSE,IT, Passout: 2027)..." -ForegroundColor Cyan
$rules = @{
    driveId = $googleDrive.id
    minCgpa = 7.0
    min10th = 60.0
    min12th = 60.0
    maxActiveBacklogs = 0
    maxBacklogHistory = 2
    allowedBranches = @("CSE", "IT")
    passoutYear = 2027
    policy = "ONE_OFFER"
} | ConvertTo-Json
$ruleRes = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/rules" -Method Put -Body $rules -ContentType "application/json" -Headers @{ Authorization = "Bearer $tpoToken" }
Write-Host "  [OK] Rules saved! Version: $($ruleRes.version)" -ForegroundColor Green

# 6. Evaluate with Virtual Threads
Write-Host "`n[Step 6] TPO Triggers Evaluation via Java 21 Virtual Threads..." -ForegroundColor Cyan
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$evalRes = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/evaluate" -Method Post -Headers @{ Authorization = "Bearer $tpoToken" }
$sw.Stop()
Write-Host "  [OK] Evaluation completed in $($sw.ElapsedMilliseconds) ms!" -ForegroundColor Green
Write-Host "  [OK] Total Evaluated: $($evalRes.total), Eligible: $($evalRes.eligible)" -ForegroundColor Yellow

# 7. Student 1 Check Eligibility (Pass)
Write-Host "`n[Step 7] Student 1 (Aarav - CGPA 8.5, 0 backlogs) checks eligibility..." -ForegroundColor Cyan
$s1Check = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/eligibility/me" -Method Get -Headers @{ Authorization = "Bearer $s1Token" }
Write-Host "  Result: Eligible = $($s1Check.eligible)" -ForegroundColor Green

# 8. Student 2 Check Eligibility (Fail)
Write-Host "`n[Step 8] Student 2 (Neha - CGPA 6.5, 1 backlog) checks eligibility..." -ForegroundColor Cyan
$s2Check = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/eligibility/me" -Method Get -Headers @{ Authorization = "Bearer $s2Token" }
Write-Host "  Result: Eligible = $($s2Check.eligible)" -ForegroundColor Red
Write-Host "  Reasons: $($s2Check.reasons -join ' | ')" -ForegroundColor Yellow

# 9. Student 1 Applies
Write-Host "`n[Step 9] Student 1 submits application to Google..." -ForegroundColor Cyan
try {
    $appRes = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/apply" -Method Post -Headers @{ Authorization = "Bearer $s1Token" }
    Write-Host "  [OK] Application Submitted! Status: $($appRes.status)" -ForegroundColor Green
} catch {
    Write-Host "  [INFO] $($_.Exception.Message)" -ForegroundColor Yellow
}

# 10. Student 2 Tries to Apply (Should be rejected)
Write-Host "`n[Step 10] Student 2 attempts to apply (Expect 403 Forbidden)..." -ForegroundColor Cyan
try {
    $null = Invoke-RestMethod -Uri "$gateway/drives/$($googleDrive.id)/apply" -Method Post -Headers @{ Authorization = "Bearer $s2Token" }
    Write-Host "  [FAIL] Ineligible student was allowed to apply! Expected rejection." -ForegroundColor Red
} catch {
    Write-Host "  [OK] Blocked by Rule Engine: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  WALKTHROUGH COMPLETED SUCCESSFULLY!                     " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
