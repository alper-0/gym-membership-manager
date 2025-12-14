import db from '../db/connection.js';
import membershipService from './membershipService.js';

class CheckinService {
  async checkIn(memberId, staffUserId = null) {
    // Check member status
    const statusCheck = await membershipService.checkMemberStatus(memberId);

    const checkInData = {
      member_id: memberId,
      check_in_time: new Date().toISOString(),
      status: statusCheck.allowed ? 'allowed' : 'denied',
      denial_reason: statusCheck.reason || null,
      created_by: staffUserId
    };

    const result = await db.run(
      'INSERT INTO check_ins (member_id, check_in_time, status, denial_reason, created_by) VALUES (?, ?, ?, ?, ?)',
      [checkInData.member_id, checkInData.check_in_time, checkInData.status, checkInData.denial_reason, checkInData.created_by]
    );

    // Get member info
    const member = await db.get(`
      SELECT mp.first_name, mp.last_name, u.email
      FROM member_profiles mp
      JOIN users u ON mp.user_id = u.id
      WHERE mp.id = ?
    `, [memberId]);

    return {
      checkInId: result.id,
      allowed: statusCheck.allowed,
      reason: statusCheck.reason,
      member: member,
      timestamp: checkInData.check_in_time
    };
  }

  async getCheckInHistory(memberId, limit = 50) {
    return db.all(`
      SELECT * FROM check_ins
      WHERE member_id = ?
      ORDER BY check_in_time DESC
      LIMIT ?
    `, [memberId, limit]);
  }
}

export default new CheckinService();
