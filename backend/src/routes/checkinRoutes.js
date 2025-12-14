import express from 'express';
import checkinService from '../services/checkinService.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import db from '../db/connection.js';

const router = express.Router();

// Staff performs check-in
router.post('/checkin', authenticateToken, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { memberEmail } = req.body;
    
    // Find member by email
    const user = await db.get('SELECT id FROM users WHERE email = ?', [memberEmail.toLowerCase()]);
    if (!user) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const profile = await db.get('SELECT id FROM member_profiles WHERE user_id = ?', [user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Member profile not found' });
    }

    const result = await checkinService.checkIn(profile.id, req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get check-in history (client views own)
router.get('/my-checkins', authenticateToken, authorize('client'), async (req, res) => {
  try {
    const profile = await db.get('SELECT id FROM member_profiles WHERE user_id = ?', [req.user.userId]);
    const history = await checkinService.getCheckInHistory(profile.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
