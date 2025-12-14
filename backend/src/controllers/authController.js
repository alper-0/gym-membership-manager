import authService from '../services/authService.js';
import { validateEmail, validatePassword, validateName, validatePhone } from '../utils/validators.js';
import db from '../db/connection.js';

/**
 * Register a new client account
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, password, first name, and last name are required' 
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Validate names
    if (!validateName(firstName)) {
      return res.status(400).json({ 
        error: 'First name must be 2-100 characters and contain only letters, spaces, or hyphens' 
      });
    }

    if (!validateName(lastName)) {
      return res.status(400).json({ 
        error: 'Last name must be 2-100 characters and contain only letters, spaces, or hyphens' 
      });
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ 
        error: 'Invalid phone format. Use E.164 format (e.g., +1234567890)' 
      });
    }

    // Call service to register
    const result = await authService.register({ 
      email, 
      password, 
      firstName, 
      lastName, 
      phone 
    });

    // Log audit trail
    await db.run(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [result.userId, 'USER_REGISTERED', 'user', result.userId, req.ip]
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Verify email with 5-digit code
 * POST /api/auth/verify-email
 */
export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    // Validate required fields
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate code format (5 digits)
    if (!/^\d{5}$/.test(code)) {
      return res.status(400).json({ error: 'Code must be 5 digits' });
    }

    // Call service to verify
    const result = await authService.verifyEmail(email, code);

    // Log audit trail
    const user = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (user) {
      await db.run(
        'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [user.id, 'EMAIL_VERIFIED', 'user', user.id, req.ip]
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Resend verification code
 * POST /api/auth/resend-code
 */
export async function resendCode(req, res) {
  try {
    const { email } = req.body;

    // Validate required field
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get user
    const user = await db.get(
      'SELECT id, email, status FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.status === 'active') {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Get member profile for name
    const profile = await db.get(
      'SELECT first_name FROM member_profiles WHERE user_id = ?', 
      [user.id]
    );

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Check resend cooldown (60 seconds)
    const lastVerification = await db.get(
      'SELECT created_at FROM email_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (lastVerification) {
      const lastSentTime = new Date(lastVerification.created_at);
      const now = new Date();
      const secondsSinceLastSent = (now - lastSentTime) / 1000;

      if (secondsSinceLastSent < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLastSent);
        return res.status(429).json({ 
          error: `Please wait ${remainingSeconds} seconds before requesting a new code` 
        });
      }
    }

    // Send new verification code
    await authService.sendVerificationCode(user.id, user.email, profile.first_name);

    // Log audit trail
    await db.run(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'VERIFICATION_CODE_RESENT', 'user', user.id, req.ip]
    );

    res.json({ message: 'Verification code sent. Please check your email.' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Login user (client, staff, or admin)
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Call service to login
    const result = await authService.login(email, password);

    // Log audit trail
    await db.run(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [result.user.id, 'USER_LOGIN', 'user', result.user.id, req.ip]
    );

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
}

/**
 * Logout user (optional - for audit trail)
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  try {
    // User ID comes from auth middleware
    const userId = req.user?.userId;

    if (userId) {
      // Log audit trail
      await db.run(
        'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [userId, 'USER_LOGOUT', 'user', userId, req.ip]
      );
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}

/**
 * Request password reset (sends code to email)
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Validate required field
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get user
    const user = await db.get(
      'SELECT id, email, status FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({ 
        message: 'If an account exists with this email, a password reset code has been sent.' 
      });
    }

    if (user.status !== 'active') {
      return res.status(400).json({ error: 'Account is not active' });
    }

    // Get member profile for name (handle all user types)
    let firstName = 'User';
    if (user.role === 'client') {
      const profile = await db.get(
        'SELECT first_name FROM member_profiles WHERE user_id = ?', 
        [user.id]
      );
      if (profile) firstName = profile.first_name;
    }

    // Send password reset code
    await authService.sendPasswordResetCode(user.id, user.email, firstName);

    // Log audit trail
    await db.run(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'PASSWORD_RESET_REQUESTED', 'user', user.id, req.ip]
    );

    res.json({ 
      message: 'If an account exists with this email, a password reset code has been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
}

/**
 * Reset password with code
 * POST /api/auth/reset-password
 */
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;

    // Validate required fields
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        error: 'Email, code, and new password are required' 
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate code format (6 digits for password reset)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Code must be 6 digits' });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Call service to reset password
    const result = await authService.resetPassword(email, code, newPassword);

    // Log audit trail
    const user = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (user) {
      await db.run(
        'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [user.id, 'PASSWORD_RESET', 'user', user.id, req.ip]
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;

    // Get user details
    const user = await db.get(
      'SELECT id, email, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get profile if client
    let profile = null;
    if (user.role === 'client') {
      profile = await db.get(
        'SELECT * FROM member_profiles WHERE user_id = ?',
        [userId]
      );
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        profile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user information' });
  }
}

/**
 * Change password (authenticated user)
 * POST /api/auth/change-password
 */
export async function changePassword(req, res) {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        error: 'New password must be different from current password' 
      });
    }

    // Call service to change password
    const result = await authService.changePassword(userId, currentPassword, newPassword);

    // Log audit trail
    await db.run(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [userId, 'PASSWORD_CHANGED', 'user', userId, req.ip]
    );

    res.json(result);
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({ error: error.message });
  }
}
