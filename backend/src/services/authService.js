import db from '../db/connection.js';
import { 
  hashPassword, 
  verifyPassword, 
  generateVerificationCode, 
  hashVerificationCode, 
  verifyVerificationCode 
} from '../utils/crypto.js';
import emailService from '../utils/email.js';
import config from '../config/index.js';
import jwt from 'jsonwebtoken';

class AuthService {
  /**
   * Register a new client account
   * Creates user, profile, and sends verification email
   */
  async register({ email, password, firstName, lastName, phone }) {
    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id, status FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (existingUser) {
      if (existingUser.status === 'unverified') {
        throw new Error('Email already registered but not verified. Please check your email or request a new verification code.');
      }
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await db.run(
      'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
      [email.toLowerCase(), passwordHash, 'client', 'unverified']
    );

    const userId = userResult.id;

    try {
      // Create member profile
      await db.run(
        'INSERT INTO member_profiles (user_id, first_name, last_name, phone) VALUES (?, ?, ?, ?)',
        [userId, firstName, lastName, phone || null]
      );

      // Generate and send verification code
      await this.sendVerificationCode(userId, email.toLowerCase(), firstName);

      return {
        userId: userId,
        email: email.toLowerCase(),
        message: 'Registration successful. Please check your email for verification code.'
      };
    } catch (error) {
      // Rollback: delete user if profile creation or email sending fails
      await db.run('DELETE FROM users WHERE id = ?', [userId]);
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Generate and send verification code to user's email
   * Used for email verification during registration
   */
  async sendVerificationCode(userId, email, firstName) {
    // Generate 5-digit code
    const code = generateVerificationCode(5);
    console.log(`[DEV] Verification code for ${email}: ${code}`);

    // Hash the code before storing
    const codeHash = await hashVerificationCode(code);
    
    // Calculate expiration time
    const expiresAt = new Date(
      Date.now() + config.security.verificationCodeExpiry * 60 * 1000
    );

    // Delete any existing verification records for this user
    await db.run('DELETE FROM email_verifications WHERE user_id = ?', [userId]);

    // Store hashed code with expiration
    await db.run(
      'INSERT INTO email_verifications (user_id, code_hash, expires_at, attempts) VALUES (?, ?, ?, ?)',
      [userId, codeHash, expiresAt.toISOString(), 0]
    );

    // Send email with code
    try {
      await emailService.sendVerificationCode(email, code, firstName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't throw error - code is stored and can be resent
    }

    return { 
      sent: true,
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * Verify user's email with 5-digit code
   * Activates the user account upon successful verification
   */
  async verifyEmail(email, code) {
    // Get user
    const user = await db.get(
      'SELECT id, status FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Check if already verified
    if (user.status === 'active') {
      throw new Error('Email already verified');
    }

    if (user.status === 'suspended') {
      throw new Error('Account is suspended. Please contact support.');
    }

    if (user.status === 'deleted') {
      throw new Error('Account not found');
    }

    // Get verification record
    const verification = await db.get(
      'SELECT * FROM email_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!verification) {
      throw new Error('No verification code found. Please request a new one.');
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);
    
    if (expiresAt < now) {
      throw new Error('Verification code expired. Please request a new one.');
    }

    // Check max attempts
    if (verification.attempts >= config.security.maxVerificationAttempts) {
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    // Verify the code
    const isValid = await verifyVerificationCode(verification.code_hash, code);

    // Update attempts count
    await db.run(
      'UPDATE email_verifications SET attempts = attempts + 1, last_attempt_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verification.id]
    );

    if (!isValid) {
      const remainingAttempts = config.security.maxVerificationAttempts - (verification.attempts + 1);
      
      if (remainingAttempts <= 0) {
        throw new Error('Too many failed attempts. Please request a new code.');
      }
      
      throw new Error(`Invalid verification code. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`);
    }

    // Code is valid - activate user and clean up
    await db.run(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      ['active', user.id]
    );
    
    await db.run('DELETE FROM email_verifications WHERE user_id = ?', [user.id]);

    return { 
      verified: true, 
      message: 'Email verified successfully. You can now log in.' 
    };
  }

  /**
   * Authenticate user and generate JWT token
   * Supports all user roles (client, staff, admin)
   */
  async login(email, password) {
    // Get user
    const user = await db.get(
      'SELECT id, email, password_hash, role, status FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check account status
    if (user.status === 'unverified') {
      throw new Error('Please verify your email before logging in. Check your inbox for the verification code.');
    }

    if (user.status === 'suspended') {
      throw new Error('Your account has been suspended. Please contact support.');
    }

    if (user.status === 'deleted') {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active. Please contact support.');
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password_hash, password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Get additional profile data based on role
    let profile = null;
    
    if (user.role === 'client') {
      profile = await db.get(
        'SELECT * FROM member_profiles WHERE user_id = ?', 
        [user.id]
      );
    }

    // Update last login timestamp (optional)
    await db.run(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      }
    };
  }

  /**
   * Send password reset code to user's email
   * Uses 6-digit code for password reset (different from verification)
   */
  async sendPasswordResetCode(userId, email, firstName) {
    // Generate 6-digit code for password reset
    const code = generateVerificationCode(6);
    console.log(`[DEV] Password reset code for ${email}: ${code}`);

    // Hash the code before storing
    const codeHash = await hashVerificationCode(code);
    
    // Calculate expiration time (30 minutes for password reset)
    const expiresAt = new Date(
      Date.now() + config.security.passwordResetExpiry * 60 * 1000
    );

    // Delete any existing password reset records for this user
    await db.run('DELETE FROM password_resets WHERE user_id = ?', [userId]);

    // Store hashed code with expiration
    await db.run(
      'INSERT INTO password_resets (user_id, code_hash, expires_at, attempts) VALUES (?, ?, ?, ?)',
      [userId, codeHash, expiresAt.toISOString(), 0]
    );

    // Send email with code
    try {
      await emailService.sendPasswordResetCode(email, code, firstName);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't throw error - code is stored
    }

    return { 
      sent: true,
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * Reset user password using reset code
   * Verifies code and updates password
   */
  async resetPassword(email, code, newPassword) {
    // Get user
    const user = await db.get(
      'SELECT id, status FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (!user) {
      throw new Error('Invalid reset code');
    }

    // Only active users can reset password
    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    // Get password reset record
    const resetRecord = await db.get(
      'SELECT * FROM password_resets WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!resetRecord) {
      throw new Error('No password reset request found. Please request a new code.');
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(resetRecord.expires_at);
    
    if (expiresAt < now) {
      throw new Error('Reset code expired. Please request a new one.');
    }

    // Check max attempts
    if (resetRecord.attempts >= config.security.maxVerificationAttempts) {
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    // Verify the code
    const isValid = await verifyVerificationCode(resetRecord.code_hash, code);

    // Update attempts count
    await db.run(
      'UPDATE password_resets SET attempts = attempts + 1, last_attempt_at = CURRENT_TIMESTAMP WHERE id = ?',
      [resetRecord.id]
    );

    if (!isValid) {
      const remainingAttempts = config.security.maxVerificationAttempts - (resetRecord.attempts + 1);
      
      if (remainingAttempts <= 0) {
        throw new Error('Too many failed attempts. Please request a new code.');
      }
      
      throw new Error(`Invalid reset code. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`);
    }

    // Code is valid - hash new password and update
    const passwordHash = await hashPassword(newPassword);
    
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [passwordHash, user.id]
    );
    
    // Clean up reset records
    await db.run('DELETE FROM password_resets WHERE user_id = ?', [user.id]);

    return { 
      success: true, 
      message: 'Password reset successfully. You can now log in with your new password.' 
    };
  }

  /**
   * Change password for authenticated user
   * Requires current password verification
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Get user with password hash
    const user = await db.get(
      'SELECT id, email, password_hash, status FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    // Verify current password
    const isValidPassword = await verifyPassword(user.password_hash, currentPassword);
    
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await verifyPassword(user.password_hash, newPassword);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    // Hash new password and update
    const passwordHash = await hashPassword(newPassword);
    
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, userId]
    );

    return { 
      success: true, 
      message: 'Password changed successfully' 
    };
  }

  /**
   * Verify JWT token and return decoded payload
   * Used by authentication middleware
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return { valid: true, payload: decoded };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, error: 'Token expired' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { valid: false, error: 'Invalid token' };
      }
      return { valid: false, error: 'Token verification failed' };
    }
  }

  /**
   * Refresh JWT token (optional feature)
   * Generates new token if current one is valid
   */
  async refreshToken(oldToken) {
    const verification = this.verifyToken(oldToken);
    
    if (!verification.valid) {
      throw new Error('Invalid or expired token');
    }

    const { userId, email, role } = verification.payload;

    // Check if user still exists and is active
    const user = await db.get(
      'SELECT id, status FROM users WHERE id = ?',
      [userId]
    );

    if (!user || user.status !== 'active') {
      throw new Error('User is no longer active');
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId, email, role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { token: newToken };
  }

  /**
   * Check if email exists and is verified
   * Utility method for checking email availability
   */
  async checkEmailExists(email) {
    const user = await db.get(
      'SELECT id, status FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      return { exists: false, verified: false };
    }

    return { 
      exists: true, 
      verified: user.status === 'active',
      status: user.status 
    };
  }

  /**
   * Request account deletion (soft delete)
   * Marks account as deleted but keeps data for audit
   */
  async requestAccountDeletion(userId, password) {
    // Get user
    const user = await db.get(
      'SELECT id, password_hash, status FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password_hash, password);
    
    if (!isValidPassword) {
      throw new Error('Password is incorrect');
    }

    // Mark as deleted (soft delete)
    await db.run(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['deleted', userId]
    );

    // Cancel any active subscriptions
    await db.run(
      `UPDATE subscriptions 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE member_id IN (SELECT id FROM member_profiles WHERE user_id = ?) 
       AND status = 'active'`,
      [userId]
    );

    return { 
      success: true, 
      message: 'Account deletion requested. Your data will be retained for audit purposes.' 
    };
  }
}

export default new AuthService();
