import express from 'express';
import membershipService from '../services/membershipService.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import db from '../db/connection.js';

const router = express.Router();

// Admin only - create plan
router.post('/plans', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { name, description, durationDays, price } = req.body;
    const result = await membershipService.createPlan({ name, description, durationDays, price });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Public - get all plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await membershipService.getAllPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin/Staff - create subscription for member
router.post('/subscriptions', authenticateToken, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { memberId, planId, startDate } = req.body;
    const result = await membershipService.createSubscription(memberId, planId, startDate);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Client - get own subscription
router.get('/my-subscription', authenticateToken, authorize('client'), async (req, res) => {
  try {
    const profile = await db.get('SELECT id FROM member_profiles WHERE user_id = ?', [req.user.userId]);
    
    if (!profile) {
      return res.status(404).json({ error: 'Member profile not found' });
    }
    
    const subscription = await membershipService.getMemberActiveSubscription(profile.id);
    res.json(subscription || { message: 'No active subscription' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
