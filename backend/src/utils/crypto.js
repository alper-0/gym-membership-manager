import argon2 from 'argon2';
import crypto from 'crypto';

export async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4
  });
}

export async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function generateVerificationCode(length = 5) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max).toString().padStart(length, '0');
}

export async function hashVerificationCode(code) {
  // Lighter hashing for short-lived codes
  return argon2.hash(code, {
    type: argon2.argon2id,
    memoryCost: 32768, // 32 MB
    timeCost: 2,
    parallelism: 2
  });
}

export async function verifyVerificationCode(hash, code) {
  try {
    return await argon2.verify(hash, code);
  } catch {
    return false;
  }
}
