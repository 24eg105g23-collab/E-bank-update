import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_store.json');

const INITIAL_DATA = {
  customerProfile: {
    id: "CUST-90821",
    name: "Aarav Sharma",
    accountNumber: "4092-8194-8210",
    accountType: "Premium Savings Account",
    branch: "Connaught Place Branch, New Delhi",
    mobile: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    address: "Flat 402, Green Valley Heights, Sector 62, Noida, UP - 201301",
    kycStatus: "VERIFIED",
    kycScore: 94,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    signatureUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/John_Hancock_signature.svg",
    identityProofType: "Aadhaar Card",
    identityProofNumber: "XXXX-XXXX-8921",
    lastUpdated: "2026-08-15T10:30:00.000Z"
  },
  requests: [
    {
      id: "REQ-2026-9041",
      customerId: "CUST-90821",
      customerName: "Aarav Sharma",
      accountNumber: "4092-8194-8210",
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      status: "PENDING",
      fieldsToUpdate: ["mobile", "address"],
      updates: {
        mobile: "+91 98112 34567",
        address: "Villa 12, Palm Meadows, Golf Course Road, Gurugram, HR - 122002"
      },
      documents: {
        addressProof: {
          name: "Utility_Bill_Gurugram_Aug2026.pdf",
          url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
          type: "Utility Electricity Bill"
        }
      },
      verificationNote: null,
      verifiedBy: null,
      verifiedAt: null,
      urgency: "HIGH",
      otpVerified: true
    },
    {
      id: "REQ-2026-7812",
      customerId: "CUST-90821",
      customerName: "Aarav Sharma",
      accountNumber: "4092-8194-8210",
      submittedAt: "2026-06-10T14:20:00.000Z",
      status: "APPROVED",
      fieldsToUpdate: ["email"],
      updates: {
        email: "aarav.sharma@example.com"
      },
      documents: {},
      verificationNote: "Email ownership verified via secure OTP match. System automated check passed.",
      verifiedBy: "EMP-409 (Priya Sundaram)",
      verifiedAt: "2026-06-10T15:05:00.000Z",
      urgency: "MEDIUM",
      otpVerified: true
    }
  ],
  notifications: [
    {
      id: "NOTIF-101",
      title: "KYC Verification Approved",
      message: "Your request REQ-2026-7812 for Email update was verified and approved by bank staff.",
      timestamp: "2026-06-10T15:05:00.000Z",
      read: false,
      type: "SUCCESS"
    },
    {
      id: "NOTIF-102",
      title: "New Request Submitted",
      message: "Request REQ-2026-9041 for Mobile & Address update has been submitted for bank officer verification.",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      read: true,
      type: "INFO"
    }
  ],
  auditLogs: [
    {
      id: "AUDIT-5001",
      requestId: "REQ-2026-7812",
      action: "REQUEST_APPROVED",
      performedBy: "EMP-409 (Priya Sundaram)",
      timestamp: "2026-06-10T15:05:00.000Z",
      details: "Approved Email update from aarav.old@example.com to aarav.sharma@example.com",
      ipAddress: "192.168.1.45"
    },
    {
      id: "AUDIT-5002",
      requestId: "REQ-2026-9041",
      action: "REQUEST_SUBMITTED",
      performedBy: "CUST-90821 (Customer Self-Service)",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      details: "Submitted update request for Mobile & Address with Electricity Bill upload.",
      ipAddress: "49.36.18.204"
    }
  ],
  activeOtpStore: {}
};

export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(INITIAL_DATA);
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db_store.json, resetting to default:", err);
    saveDb(INITIAL_DATA);
    return INITIAL_DATA;
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving to db_store.json:", err);
  }
}
