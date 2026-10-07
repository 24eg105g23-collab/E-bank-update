import express from 'express';
import { getDb, saveDb } from '../db.js';

const router = express.Router();

// Get audit logs
router.get('/audit-logs', (req, res) => {
  const db = getDb();
  return res.json({
    success: true,
    count: (db.auditLogs || []).length,
    data: db.auditLogs || []
  });
});

// Get notifications
router.get('/notifications', (req, res) => {
  const db = getDb();
  return res.json({
    success: true,
    count: (db.notifications || []).length,
    unreadCount: (db.notifications || []).filter(n => !n.read).length,
    data: db.notifications || []
  });
});

// Mark notification as read
router.patch('/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const notif = (db.notifications || []).find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveDb(db);
  }

  return res.json({
    success: true,
    data: db.notifications || []
  });
});

// Mark all notifications as read
router.post('/notifications/read-all', (req, res) => {
  const db = getDb();
  (db.notifications || []).forEach(n => { n.read = true; });
  saveDb(db);

  return res.json({
    success: true,
    data: db.notifications || []
  });
});

export default router;
