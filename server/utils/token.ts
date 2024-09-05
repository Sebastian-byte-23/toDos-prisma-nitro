import { randomBytes } from 'node:crypto';

export function generateToken() {
  return randomBytes(48).toString('hex');
}
