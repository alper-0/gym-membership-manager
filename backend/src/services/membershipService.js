import db from '../db/connection.js';

class MembershipService {
  async createPlan({ name, description, durationDays, price }) {
    const result = await db.run(
      'INSERT INTO membership_plans (name, description, duration_days, price) VALUES (?, ?, ?, ?)',
      [name, description, durationDays, price]
    );
    return { id: result.id, name, durationDays, price };
  }

  async getAllPlans() {
    return db.all('SELECT * FROM membership_plans WHERE status = ? ORDER BY price ASC', ['active']);
  }

  async createSubscription(memberId, planId, startDate = null) {
    const plan = await db.get('SELECT * FROM membership_plans WHERE id = ?', [planId]);
    if (!plan) throw new Error('Plan not found');

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + plan.duration_days);

    const result = await db.run(
      'INSERT INTO subscriptions (member_id, plan_id, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [memberId, planId, 'active', start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
    );

    return {
      id: result.id,
      memberId,
      planId,
      planName: plan.name,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status: 'active'
    };
  }

  async getMemberActiveSubscription(memberId) {
    const subscription = await db.get(`
      SELECT s.*, p.name as plan_name, p.duration_days, p.price
      FROM subscriptions s
      JOIN membership_plans p ON s.plan_id = p.id
      WHERE s.member_id = ? AND s.status = 'active'
      ORDER BY s.end_date DESC
      LIMIT 1
    `, [memberId]);

    if (subscription) {
      // Check if expired
      if (new Date(subscription.end_date) < new Date()) {
        await db.run('UPDATE subscriptions SET status = ? WHERE id = ?', ['expired', subscription.id]);
        subscription.status = 'expired';
      }
    }

    return subscription;
  }

  async checkMemberStatus(memberId) {
    const subscription = await this.getMemberActiveSubscription(memberId);
    
    if (!subscription) {
      return { allowed: false, reason: 'No active subscription' };
    }

    if (subscription.status !== 'active') {
      return { allowed: false, reason: `Subscription is ${subscription.status}` };
    }

    if (new Date(subscription.end_date) < new Date()) {
      return { allowed: false, reason: 'Subscription expired' };
    }

    return { allowed: true, subscription };
  }
}

export default new MembershipService();
