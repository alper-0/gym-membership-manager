import authService from '../services/authService.js';
import { validateEmail, validatePassword, validateName, validatePhone } from '../utils/validators.js';

export async function register(req, res) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate inputs
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      return res.status(400).json({ error: 'Invalid name format' });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    const result = await authService.register({ email, password, firstName, lastName, phone });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const result = await authService.verifyEmail(email, code);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function resendCode(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await db.get('SELECT id, email FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = await db.get('SELECT first_name FROM member_profiles WHERE user_id = ?', [user.id]);
    await authService.sendVerificationCode(user.id, user.email, profile.first_name);

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
