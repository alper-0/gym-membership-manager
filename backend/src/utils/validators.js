export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 255;
}

export function validatePassword(password) {
  if (password.length < 8 || password.length > 128) {
    return { valid: false, message: 'Password must be between 8 and 128 characters' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
}

export function validateName(name) {
  return /^[a-zA-Z\s\-]{2,100}$/.test(name);
}

export function validatePhone(phone) {
  // E.164 format optional validation
  return !phone || /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-()]/g, ''));
}
