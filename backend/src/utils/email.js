import nodemailer from 'nodemailer';
import config from '../config/index.js';

class EmailService {
  constructor() {
    if (config.email.mode === 'smtp') {
      this.transporter = nodemailer.createTransport(config.email.smtp);
    } else {
      this.transporter = null; // Console mode
    }
  }

  async sendVerificationCode(email, code, firstName) {
    const subject = 'Verify Your Email - Gym Membership Manager';
    const html = `
      <h1>Welcome to Gym Membership Manager!</h1>
      <p>Hi ${firstName},</p>
      <p>Your verification code is:</p>
      <h2 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 10px;">${code}</h2>
      <p>This code will expire in ${config.security.verificationCodeExpiry} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendPasswordResetCode(email, code, firstName) {
    const subject = 'Password Reset Code - Gym Membership Manager';
    const html = `
      <h1>Password Reset Request</h1>
      <p>Hi ${firstName},</p>
      <p>Your password reset code is:</p>
      <h2 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 10px;">${code}</h2>
      <p>This code will expire in ${config.security.passwordResetExpiry} minutes.</p>
      <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendEmail(to, subject, html) {
    if (config.email.mode === 'console') {
      console.log('\n=== EMAIL (Console Mode) ===');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html.replace(/<[^>]*>/g, '')}`);
      console.log('============================\n');
      return { success: true, mode: 'console' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
