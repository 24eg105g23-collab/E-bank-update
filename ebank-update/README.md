# 🏦 E-Bank Update – Digital Banking & KYC Modification System

> **Full-Stack College Project** built with **React (Vite) + Spring Boot (Java 21) + Spring Data JPA + MySQL 8.0**.

---

## 📌 Project Overview

**E-Bank Update** is a digital banking customer-information and KYC update platform. It digitizes the manual paper-form submission process at bank branches.

Customers can securely submit update requests online for:
- Specimen Signature
- Identity Photograph
- Registered Mobile Number
- Registered Email Address
- Permanent Residential Address
- KYC Documentation

Bank officers / Admins can review pending requests side-by-side with master records, inspect uploaded identity documents, add verification remarks, and approve or reject submissions. Approvals automatically sync to the customer's master bank record.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Tailwind CSS, Lucide Icons
- **Backend**: Java 21, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Spring Security (BCrypt Hashing)
- **Database**: MySQL 8.0 (Database: `ebank_update`)
- **Storage**: Local Multipart File Storage (`uploads/`) with inline preview streaming

---

## 👥 User Roles & Demo Credentials

The system comes pre-seeded with hashed credentials ready for immediate presentation:

| Role | Username / ID | Password | Access Portal |
|---|---|---|---|
| **Customer** | `customer01` | `Customer@123` | `/customer/dashboard` |
| **Bank Employee / Admin** | `admin01` | `Admin@123` | `/admin/dashboard` |

> Additional customers can register via `/register`.

---

## 🚀 Key Features

### 👤 Customer Portal
1. **Secure Registration & Login**: Role-based access with BCrypt password encryption.
2. **Dashboard Overview**: Metrics for Pending, Approved, and Rejected requests, along with profile completion status.
3. **Customer Profile**: View personal records, account number, branch details, and current specimen signature.
4. **Information Update Wizard**: Select update type (Signature, Photo, Mobile, Email, Address, KYC) with file upload and live thumbnail preview.
5. **My Requests History**: Filter requests by status (`ALL`, `PENDING`, `APPROVED`, `REJECTED`), view live officer remarks, and preview uploaded documents.

### 🛡️ Bank Employee / Admin Portal
1. **Operations Dashboard**: Live counters for Total Customers, Pending Queue, Approved Requests, and Rejected Requests.
2. **Searchable & Filterable Requests Queue**: Filter by status or search by Customer ID / Name.
3. **Side-by-Side Review Screen**: Compares current customer master record with newly submitted values and uploaded specimen files.
4. **Approval & Rejection Actions**: Add review remarks, record timestamped audit trails, and automatically sync master customer data upon approval.

---

## 🔄 End-to-End Demo Workflow

To demonstrate the application:

1. **Open Frontend**: Navigate to `http://localhost:3000/login`.
2. **Customer Log In**:
   - Select **Customer** tab.
   - Enter `customer01` / `Customer@123`.
   - Click **Sign In**.
3. **Submit Update Request**:
   - Click **Update Info** or select **Update Signature**.
   - Attach a signature image file.
   - Enter remarks and submit.
   - Request status is immediately marked **PENDING**.
4. **Employee Log In**:
   - Logout and select **Bank Employee** tab at login.
   - Enter `admin01` / `Admin@123`.
   - Click **Sign In**.
5. **Review & Approve**:
   - On the Employee Dashboard, see the pending request.
   - Click **Inspect & Review**.
   - Compare the old signature and the uploaded new signature side-by-side.
   - Enter remarks: *"Signature verified and attested."*
   - Click **Approve Request**.
6. **Customer Verification**:
   - Log back in as `customer01`.
   - Go to **My Requests** → Status is now **APPROVED** with employee remarks.
   - Go to **My Profile** → Specimen signature has been automatically updated.

---

## 📁 Project Structure

```text
ebank-update/
├── backend/
│   ├── pom.xml
│   ├── src/main/
│   │   ├── java/com/ebank/update/
│   │   │   ├── config/          # SecurityConfig, WebMvcConfig, DataInitializer
│   │   │   ├── controller/      # Auth, Customer, Request, Admin, File controllers
│   │   │   ├── dto/             # Request/Response data transfer objects
│   │   │   ├── entity/          # User, Customer, UpdateRequest, RequestHistory
│   │   │   ├── repository/      # Spring Data JPA repositories
│   │   │   ├── service/         # BankService, FileStorageService
│   │   │   └── EBankUpdateApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── uploads/                 # Uploaded files
│
└── client/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/          # ProtectedRoute, GlobalToast, etc.
        ├── context/             # AuthContext
        ├── layouts/             # CustomerLayout, AdminLayout
        ├── pages/               # Login, Register, Dashboards, Requests, Profile
        ├── services/            # Axios API client (api.js)
        ├── App.jsx
        └── main.jsx
```

---

## 🔌 REST API Specification

### Authentication
- `POST /api/auth/register` – Register a new customer
- `POST /api/auth/login` – Authenticate customer or bank employee

### Customer Operations
- `GET /api/customers/profile` – Fetch logged-in customer's profile
- `PUT /api/customers/profile` – Update contact details
- `POST /api/requests` – Submit update request (supports `multipart/form-data`)
- `GET /api/requests/my` – Retrieve logged-in customer's update requests
- `GET /api/requests/{id}` – Get details of a single request

### Bank Employee / Admin Operations
- `GET /api/admin/dashboard` – Operational metrics & recent requests
- `GET /api/admin/requests` – List all requests (supports `?status=PENDING` filter)
- `GET /api/admin/requests/{id}` – Detailed inspection of a request
- `PUT /api/admin/requests/{id}/approve` – Approve request and sync customer master
- `PUT /api/admin/requests/{id}/reject` – Reject request with remarks
- `GET /api/admin/requests/{id}/history` – Audit trail lifecycle history

### File Management
- `GET /api/files/{fileName}` – View or download uploaded proof documents

---

## ⚙️ How to Run Locally

### 1. Database Setup (MySQL)
Ensure MySQL is running on port `3307` (or change port to `3306` in `application.properties`):
```sql
CREATE DATABASE ebank_update;
```

### 2. Run Backend (Spring Boot)
Open terminal in `ebank-update/backend`:
```bash
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 3. Run Frontend (React + Vite)
Open terminal in `ebank-update/client`:
```bash
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`
