import dotenv from 'dotenv';
dotenv.config();

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    path: process.env.DATABASE_PATH || './data/gym.sqlite'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  email: {
    mode: process.env.EMAIL_MODE || 'console',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@gymmanager.com'
  },
  security: {
    verificationCodeExpiry: parseInt(process.env.VERIFICATION_CODE_EXPIRY_MINUTES || '15'),
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY_MINUTES || '30'),
    maxVerificationAttempts: parseInt(process.env.MAX_VERIFICATION_ATTEMPTS || '5')
  }
};
