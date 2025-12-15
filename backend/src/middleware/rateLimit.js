import db from '../db/connection.js';

export function createRateLimiter(action, maxAttempts, windowMinutes) {
  return async (req, res, next) => {
    const identifier = req.body.email || req.ip;
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

    try {
      const record = await db.get(
        'SELECT * FROM rate_limits WHERE identifier = ? AND action = ?',
        [identifier, action]
      );

      if (record) {
        // Check if locked
        if (record.locked_until && new Date(record.locked_until) > new Date()) {
          const remainingSeconds = Math.ceil((new Date(record.locked_until) - new Date()) / 1000);
          return res.status(429).json({
            error: `Too many attempts. Please try again in ${remainingSeconds} seconds.`
          });
        }

        // Check window
        if (new Date(record.window_start) < windowStart) {
          // Reset window
          await db.run(
            'UPDATE rate_limits SET attempts = 1, window_start = CURRENT_TIMESTAMP, locked_until = NULL WHERE id = ?',
            [record.id]
          );
        } else if (record.attempts >= maxAttempts) {
          // Lock for 5 minutes
          const lockUntil = new Date(Date.now() + 5 * 60 * 1000);
          await db.run(
            'UPDATE rate_limits SET locked_until = ? WHERE id = ?',
            [lockUntil.toISOString(), record.id]
          );
          return res.status(429).json({
            error: 'Too many attempts. Please try again in 5 minutes.'
          });
        } else {
          // Increment attempts
          await db.run(
            'UPDATE rate_limits SET attempts = attempts + 1 WHERE id = ?',
            [record.id]
          );
        }
      } else {
        // Create new record
        await db.run(
          'INSERT INTO rate_limits (identifier, action, attempts) VALUES (?, ?, 1)',
          [identifier, action]
        );
      }

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      next(); // Fail open
    }
  };
}
