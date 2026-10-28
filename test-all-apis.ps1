# SCPES - Complete End-to-End API Test Harness
param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$ViteUrl = "http://localhost:5173"
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SCPES - Microservice API Live Endpoint Verification     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Test connectivity
Write-Host "`n[Check 1] Checking API Gateway connectivity on $BaseUrl..." -ForegroundColor Cyan
try {
    $gwHealth = Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [PASS] API Gateway is LIVE. Status: $($gwHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] API Gateway on $BaseUrl is not currently reachable." -ForegroundColor Red
    Write-Host "  To start the backend infrastructure:" -ForegroundColor Yellow
    Write-Host "    1. Unpause Docker Desktop (Click Whale icon in system tray -> Resume)" -ForegroundColor Yellow
    Write-Host "    2. Run .\start-backend.ps1 in PowerShell" -ForegroundColor Yellow
    Write-Host "       or double-click .\RUN-ALL.bat" -ForegroundColor Yellow
    exit 1
}

$results = [System.Collections.Generic.List[PSObject]]::new()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int[]]$ExpectedStatus = @(200, 201, 202, 204),
        [bool]$ExpectFail = $false
    )

    $url = "$BaseUrl$Path"
    $bodyJson = if ($Body) { $Body | ConvertTo-Json -Depth 5 } else { $null }

    Write-Host "Testing [$Method] $Path ($Name)..." -NoNewline
    try {
        $params = @{
            Uri = $url
            Method = $Method
            TimeoutSec = 10
            ErrorAction = "Stop"
        }
        if ($Headers.Count -gt 0) { $params["Headers"] = $Headers }
        if ($bodyJson) {
            $params["Body"] = $bodyJson
            $params["ContentType"] = "application/json"
        }

        $res = Invoke-RestMethod @params
        Write-Host " [PASS] (HTTP 200 OK)" -ForegroundColor Green
        $results.Add([PSCustomObject]@{
            Endpoint = "$Method $Path"
            Description = $Name
            Status = "PASS"
            Details = "200 OK"
        })
        return $res
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        $msg = $_.Exception.Message
        if ($ExpectFail -and $ExpectedStatus -contains $code) {
            Write-Host " [PASS] (Expected error HTTP $code - $msg)" -ForegroundColor Green
            $results.Add([PSCustomObject]@{
                Endpoint = "$Method $Path"
                Description = $Name
                Status = "PASS (Expected Rejection)"
                Details = "HTTP $code"
            })
        } else {
            Write-Host " [FAIL] (HTTP $code - $msg)" -ForegroundColor Red
            $results.Add([PSCustomObject]@{
                Endpoint = "$Method $Path"
                Description = $Name
                Status = "FAIL"
                Details = "HTTP $code - $msg"
            })
        }
        return $null
    }
}

# --- 1. IDENTITY SERVICE ENDPOINTS ---
Write-Host "`n--- 1. Testing Identity Service Endpoints ---" -ForegroundColor Cyan

# 1.1 TPO Login
$tpoAuth = Test-Endpoint -Name "TPO Login" -Method "Post" -Path "/auth/login" -Body @{
    email = "tpo@scpes.edu"
    password = "Tpo@123"
}
$tpoToken = if ($tpoAuth) { $tpoAuth.accessToken } else { $null }

# 1.2 Student 1 Login
$s1Auth = Test-Endpoint -Name "Student 1 Login" -Method "Post" -Path "/auth/login" -Body @{
    email = "student1@scpes.edu"
    password = "Student@123"
}
$s1Token = if ($s1Auth) { $s1Auth.accessToken } else { $null }

# 1.3 Student 2 Login
$s2Auth = Test-Endpoint -Name "Student 2 Login" -Method "Post" -Path "/auth/login" -Body @{
    email = "student2@scpes.edu"
    password = "Student@123"
}
$s2Token = if ($s2Auth) { $s2Auth.accessToken } else { $null }

# 1.4 Invalid Login (Verification of Error Reflection)
Test-Endpoint -Name "Invalid Credentials Failure Reflection" -Method "Post" -Path "/auth/login" -Body @{
    email = "student1@scpes.edu"
    password = "WrongPassword999"
} -ExpectedStatus @(401) -ExpectFail $true

# 1.5 Forgot Password
Test-Endpoint -Name "Forgot Password Request" -Method "Post" -Path "/auth/forgot-password" -Body @{
    email = "student1@scpes.edu"
}

# 1.6 Recruiter Registration
$randId = Get-Random -Minimum 100 -Maximum 999
Test-Endpoint -Name "Recruiter Registration" -Method "Post" -Path "/auth/register-recruiter" -Body @{
    companyName = "Apex Labs $randId"
    recruiterName = "Jane Doe"
    email = "recruiter$randId@apexlabs.com"
    password = "Recruiter@123"
    phone = "9876543210"
    sector = "Technology"
    website = "https://apexlabs.com"
}

# --- 2. STUDENT SERVICE ENDPOINTS ---
Write-Host "`n--- 2. Testing Student Service Endpoints ---" -ForegroundColor Cyan
$studentHeaders = if ($s1Token) { @{ Authorization = "Bearer $s1Token" } } else { @{} }
Test-Endpoint -Name "Get Current Student Profile" -Method "Get" -Path "/students/me" -Headers $studentHeaders

# --- 3. PLACEMENT SERVICE ENDPOINTS ---
Write-Host "`n--- 3. Testing Placement Service Endpoints ---" -ForegroundColor Cyan
$tpoHeaders = if ($tpoToken) { @{ Authorization = "Bearer $tpoToken" } } else { @{} }

# 3.1 List All Drives
$drives = Test-Endpoint -Name "List Placement Drives" -Method "Get" -Path "/drives" -Headers $tpoHeaders
$selectedDrive = if ($drives -and $drives.Count -gt 0) { $drives[0] } else { $null }

# 3.2 Student View My Applications
Test-Endpoint -Name "Get Student Applications" -Method "Get" -Path "/applications/me" -Headers $studentHeaders

# --- 4. ELIGIBILITY SERVICE ENDPOINTS ---
Write-Host "`n--- 4. Testing Eligibility Service Endpoints ---" -ForegroundColor Cyan

if ($selectedDrive) {
    $driveId = $selectedDrive.id

    # 4.1 Set Rules
    Test-Endpoint -Name "Save Eligibility Rules" -Method "Put" -Path "/drives/$driveId/rules" -Headers $tpoHeaders -Body @{
        driveId = $driveId
        minCgpa = 7.0
        min10th = 60.0
        min12th = 60.0
        maxActiveBacklogs = 0
        maxBacklogHistory = 2
        allowedBranches = @("CSE", "IT")
        passoutYear = 2027
        policy = "ONE_OFFER"
    }

    # 4.2 Batch Evaluation via Virtual Threads
    Test-Endpoint -Name "Run Batch Eligibility Evaluation" -Method "Post" -Path "/drives/$driveId/evaluate" -Headers $tpoHeaders

    # 4.3 Student 1 Check Eligibility
    Test-Endpoint -Name "Student 1 Check My Eligibility" -Method "Get" -Path "/drives/$driveId/eligibility/me" -Headers $studentHeaders

    # 4.4 TPO View Drive Eligibility List
    Test-Endpoint -Name "TPO View Drive Eligibility Matrix" -Method "Get" -Path "/drives/$driveId/eligibility" -Headers $tpoHeaders

    # 4.5 Student 1 Apply
    Test-Endpoint -Name "Student 1 Apply to Drive" -Method "Post" -Path "/drives/$driveId/apply" -Headers $studentHeaders

    # 4.6 Student 2 Apply (Ineligible Rejection Reflection)
    $s2Headers = if ($s2Token) { @{ Authorization = "Bearer $s2Token" } } else { @{} }
    Test-Endpoint -Name "Ineligible Student Apply Rejection" -Method "Post" -Path "/drives/$driveId/apply" -Headers $s2Headers -ExpectedStatus @(403) -ExpectFail $true
}

# --- 5. REPORT SERVICE ENDPOINTS ---
Write-Host "`n--- 5. Testing Report Service Endpoints ---" -ForegroundColor Cyan
Test-Endpoint -Name "Get Department Summary" -Method "Get" -Path "/reports/department-summary?year=2027" -Headers $tpoHeaders

if ($selectedDrive) {
    Test-Endpoint -Name "Export Drive PDF Report" -Method "Get" -Path "/reports/drive/$($selectedDrive.id)/export" -Headers $tpoHeaders
}

# --- 6. NOTIFICATION SERVICE ENDPOINTS ---
Write-Host "`n--- 6. Testing Notification Service Endpoints ---" -ForegroundColor Cyan
Test-Endpoint -Name "Get Student Notifications" -Method "Get" -Path "/notifications" -Headers $studentHeaders

# --- 7. MATCHING SERVICE ENDPOINTS ---
Write-Host "`n--- 7. Testing Matching Service Endpoints ---" -ForegroundColor Cyan
Test-Endpoint -Name "Get Student Matched Jobs" -Method "Get" -Path "/jobs/matched" -Headers $studentHeaders

# Summary Table
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY                                    " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
$results | Format-Table -AutoSize
