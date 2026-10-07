import express from 'express';
import { getDb, saveDb } from '../db.js';

const router = express.Router();

// Get customer profile
router.get('/customer/profile', (req, res) => {
  const db = getDb();
  return res.json({
    success: true,
    data: db.customerProfile
  });
});

// Get all requests (optional status filter)
router.get('/requests', (req, res) => {
  const { status, customerId } = req.query;
  const db = getDb();
  let list = db.requests || [];

  if (status && status !== 'ALL') {
    list = list.filter(r => r.status === status);
  }
  if (customerId) {
    list = list.filter(r => r.customerId === customerId);
  }

  return res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// Create new KYC update request
router.post('/requests', (req, res) => {
  const { fieldsToUpdate, updates, documents, urgency } = req.body;
  const db = getDb();

  if (!fieldsToUpdate || fieldsToUpdate.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one field to update."
    });
  }

  const reqNum = Math.floor(1000 + Math.random() * 9000);
  const requestId = `REQ-2026-${reqNum}`;
  const now = new Date().toISOString();

  const newRequest = {
    id: requestId,
    customerId: db.customerProfile.id,
    customerName: db.customerProfile.name,
    accountNumber: db.customerProfile.accountNumber,
    submittedAt: now,
    status: "PENDING",
    fieldsToUpdate: fieldsToUpdate,
    updates: updates || {},
    documents: documents || {},
    verificationNote: null,
    verifiedBy: null,
    verifiedAt: null,
    urgency: urgency || "MEDIUM",
    otpVerified: true
  };

  db.requests.unshift(newRequest);

  // Add Notification
  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    title: "Request Submitted",
    message: `Your request ${requestId} for updating ${fieldsToUpdate.join(', ')} has been submitted for officer review.`,
    timestamp: now,
    read: false,
    type: "INFO"
  };
  db.notifications.unshift(newNotif);

  // Add Audit Log
  const newAudit = {
    id: `AUDIT-${Date.now()}`,
    requestId: requestId,
    action: "REQUEST_SUBMITTED",
    performedBy: `${db.customerProfile.id} (${db.customerProfile.name})`,
    timestamp: now,
    details: `Submitted update request for: ${fieldsToUpdate.join(', ')}`,
    ipAddress: "127.0.0.1"
  };
  db.auditLogs.unshift(newAudit);

  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Update request ${requestId} submitted successfully!`,
    data: newRequest
  });
});

// Employee Verification (Approve or Reject)
router.patch('/requests/:id/verify', (req, res) => {
  const { id } = req.params;
  const { action, verificationNote, employeeId, employeeName } = req.body; // action: 'APPROVE' or 'REJECT'
  const db = getDb();

  const request = db.requests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({
      success: false,
      message: `Request with ID ${id} not found.`
    });
  }

  if (request.status !== 'PENDING') {
    return res.status(400).json({
      success: false,
      message: `Request ${id} is already processed (${request.status}).`
    });
  }

  const now = new Date().toISOString();
  const staff = `${employeeId || 'EMP-108'} (${employeeName || 'Bank Verification Officer'})`;

  if (action === 'APPROVE') {
    request.status = 'APPROVED';
    request.verificationNote = verificationNote || "Verified all submitted documents and details. Verified against primary banking database.";
    request.verifiedBy = staff;
    request.verifiedAt = now;

    // Apply updates directly to Customer Profile
    Object.keys(request.updates).forEach(field => {
      if (request.updates[field]) {
        db.customerProfile[field] = request.updates[field];
      }
    });
    db.customerProfile.lastUpdated = now;

    // Notification
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: "KYC Update Approved",
      message: `Great news! Your update request ${id} has been verified and approved by bank officer ${staff}. Your records are updated.`,
      timestamp: now,
      read: false,
      type: "SUCCESS"
    });

    // Audit Log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      requestId: id,
      action: "REQUEST_APPROVED",
      performedBy: staff,
      timestamp: now,
      details: `Approved changes for fields: ${request.fieldsToUpdate.join(', ')}. Note: ${request.verificationNote}`,
      ipAddress: "10.0.4.12"
    });

  } else if (action === 'REJECT') {
    request.status = 'REJECTED';
    request.verificationNote = verificationNote || "Rejected due to document clarity issues or invalid verification proof.";
    request.verifiedBy = staff;
    request.verifiedAt = now;

    // Notification
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: "KYC Update Request Rejected",
      message: `Your request ${id} was rejected by bank staff. Reason: ${request.verificationNote}`,
      timestamp: now,
      read: false,
      type: "ERROR"
    });

    // Audit Log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      requestId: id,
      action: "REQUEST_REJECTED",
      performedBy: staff,
      timestamp: now,
      details: `Rejected request ${id}. Reason: ${request.verificationNote}`,
      ipAddress: "10.0.4.12"
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Action must be either APPROVE or REJECT"
    });
  }

  saveDb(db);

  return res.json({
    success: true,
    message: `Request ${id} has been ${request.status.toLowerCase()} successfully.`,
    data: request,
    updatedCustomerProfile: db.customerProfile
  });
});

// Reset database to initial clean state
router.post('/reset-data', (req, res) => {
  const db = getDb();
  // Clear and reload
  fs.unlinkSync(path.join(process.cwd(), 'server', 'db_store.json'));
  const freshDb = getDb();
  return res.json({
    success: true,
    message: "Database reset to initial default state.",
    data: freshDb
  });
});

export default router;
