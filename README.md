# Smart College Placement Eligibility System (SCPES) - Backend Microservices

> **Production-grade backend built with Java 21 (LTS), Spring Boot 3.3.4, Spring Cloud Gateway MVC, PostgreSQL, gRPC, Apache Kafka, and Docker.**

---

## 1. System Architecture

```
                    ┌────────────────────────┐
                    │  React Web App (5173)   │
                    └───────────┬────────────┘
                                │ HTTP / REST (JWT)
                                ▼
                    ┌────────────────────────┐
                    │  API Gateway (:8080)   │
                    │ Spring Cloud Gateway   │
                    └───────────┬────────────┘
                                │
        ┌───────────────┬───────┴───────┬───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Identity   │ │   Student    │ │  Placement   │ │ Eligibility  │ │   Matching   │
│   Service    │ │   Service    │ │   Service    │ │(Core Engine) │ │(Stage 2 NLP) │
│  :8082/9092  │ │  :8083/9093  │ │  :8084/9094  │ │  :8085/9095  │ │  :8087/9097  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │
       └────────────────┼────────────────┼────────────────┼────────────────┘
                        │ Synchronous Lookups: gRPC + Protobuf
                        │ Asynchronous Events: Apache Kafka (KRaft mode)
                        ▼
       ┌──────────────────────────────────────────────────┐
       │   PostgreSQL 16 (Schema-isolated per service)    │
       │   identity_svc | student_svc | placement_svc     │
       │   eligibility_svc | matching_svc | report_svc    │
       └──────────────────────────────────────────────────┘
```

---

## 2. Microservices Directory

| Service | HTTP Port | gRPC Port | Schema | Core Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **`api-gateway`** | `8080` | — | — | Single entry point, JWT authentication, CORS, path routing |
| **`identity-service`** | `8082` | `9092` | `identity_svc` | User login, JWT generation, token refresh, RBAC, CSV import |
| **`student-service`** | `8083` | `9093` | `student_svc` | Profile, academic records, verification workflow, resume upload |
| **`placement-service`** | `8084` | `9094` | `placement_svc` | Companies, drives, rounds, applications, round outcomes |
| **`eligibility-service`**| `8085` | `9095` | `eligibility_svc`| **Core Engine:** Configurable rule evaluation with Virtual Threads |
| **`matching-service`** | `8087` | `9097` | `matching_svc` | Apache Tika parsing, skill extractor, TF-IDF cosine similarity |
| **`notification-service`**| `8081` | `9091` | `notification_svc`| Kafka event consumer, in-app alerts, SendGrid email sender |
| **`report-service`** | `8086` | — | `report_svc` | Read-model analytics, iText PDF export |
| **`scpes-common`** | — | — | — | Shared JWT filter, Error model, Protobuf contracts, Kafka envelope |

---

## 3. Quick Start (Prerequisites: Java 21 & Docker)

### Step 1: Start PostgreSQL and Kafka
```powershell
docker compose up -d postgres kafka
```

### Step 2: Build the entire Maven project
```powershell
.\mvnw.cmd clean compile
```

### Step 3: Run the Microservices
You can run services from IntelliJ IDEA or via Maven in separate terminals:

```powershell
# Terminal 1: API Gateway
.\mvnw.cmd -pl services/api-gateway spring-boot:run

# Terminal 2: Identity Service
.\mvnw.cmd -pl services/identity-service spring-boot:run

# Terminal 3: Student Service
.\mvnw.cmd -pl services/student-service spring-boot:run

# Terminal 4: Eligibility Service
.\mvnw.cmd -pl services/eligibility-service spring-boot:run

# Terminal 5: Placement Service
.\mvnw.cmd -pl services/placement-service spring-boot:run

# Terminal 6: Matching Service
.\mvnw.cmd -pl services/matching-service spring-boot:run

# Terminal 7: Notification Service
.\mvnw.cmd -pl services/notification-service spring-boot:run

# Terminal 8: Report Service
.\mvnw.cmd -pl services/report-service spring-boot:run
```

---

## 4. Pre-Seeded Presentation Accounts

All passwords are pre-hashed with BCrypt on initial startup:

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **TPO** | `tpo@scpes.edu` | `Tpo@123` | Full placement management permissions |
| **Admin** | `admin@scpes.edu` | `Admin@123` | System administrator |
| **Faculty** | `faculty@scpes.edu` | `Faculty@123` | Student academic verification authority |
| **Recruiter** | `recruiter@google.com`| `Recruiter@123` | Google recruiter account |
| **Student 1** | `student1@scpes.edu`| `Student@123` | **Aarav Sharma:** CGPA 8.50, 0 Backlogs, CSE (Eligible) |
| **Student 2** | `student2@scpes.edu`| `Student@123` | **Neha Patel:** CGPA 6.50, 1 Backlog, IT (Shows rule failure reasons) |
| **Student 3** | `student3@scpes.edu`| `Student@123` | **Rohan Verma:** CGPA 7.20, ECE, `SUBMITTED` state (Unverified) |

---

## 5. End-to-End Presentation Walkthrough (Via Gateway `localhost:8080`)

### 1. Login as TPO
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tpo@scpes.edu", "password": "Tpo@123"}'
```
*Save the returned `accessToken`.*

### 2. Login as Student 1 (High CGPA, Verified)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@scpes.edu", "password": "Student@123"}'
```

### 3. Login as Student 2 (Low CGPA, Active Backlog)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student2@scpes.edu", "password": "Student@123"}'
```

### 4. View Available Placement Drives
```bash
curl -X GET http://localhost:8080/drives \
  -H "Authorization: Bearer <TPO_TOKEN>"
```

### 5. Define Configurable Eligibility Rules for a Drive
```bash
curl -X PUT http://localhost:8080/drives/<DRIVE_ID>/rules \
  -H "Authorization: Bearer <TPO_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "driveId": "<DRIVE_ID>",
    "minCgpa": 7.0,
    "min10th": 60.0,
    "min12th": 60.0,
    "maxActiveBacklogs": 0,
    "allowedBranches": ["CSE", "IT"],
    "passoutYear": 2027,
    "policy": "ONE_OFFER"
  }'
```

### 6. Trigger Eligibility Engine Evaluation (Hero Feature)
```bash
curl -X POST http://localhost:8080/drives/<DRIVE_ID>/evaluate \
  -H "Authorization: Bearer <TPO_TOKEN>"
```
*Returns total evaluated count and eligible count in milliseconds using Java 21 Virtual Threads.*

### 7. View Student Eligibility & Failure Reasons
* **As TPO:**
  ```bash
  curl -X GET http://localhost:8080/drives/<DRIVE_ID>/eligibility \
    -H "Authorization: Bearer <TPO_TOKEN>"
  ```
* **As Student 2 (`student2@scpes.edu`):**
  ```bash
  curl -X GET http://localhost:8080/drives/<DRIVE_ID>/eligibility/me \
    -H "Authorization: Bearer <STUDENT2_TOKEN>"
  ```
  *Output clearly states failure reasons: `["CGPA 6.50 < required 7.00", "Active backlogs 1 exceed limit 0"]`.*

### 8. Student 1 Applies in One Click
```bash
curl -X POST http://localhost:8080/drives/<DRIVE_ID>/apply \
  -H "Authorization: Bearer <STUDENT1_TOKEN>"
```

### 9. TPO Shortlists and Marks Final Result
```bash
curl -X PATCH http://localhost:8080/applications/<APPLICATION_ID>/status \
  -H "Authorization: Bearer <TPO_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "SELECTED", "packageAmount": 18.00}'
```

### 10. Student Views Live In-App Notifications
```bash
curl -X GET http://localhost:8080/notifications \
  -H "Authorization: Bearer <STUDENT1_TOKEN>"
```

### 11. Export Funnel PDF Report
```bash
curl -X GET http://localhost:8080/reports/drive/<DRIVE_ID>/export \
  -H "Authorization: Bearer <TPO_TOKEN>" \
  --output drive-report.pdf
```
