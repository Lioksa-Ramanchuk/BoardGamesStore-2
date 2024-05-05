import * as argon2 from 'argon2';
import * as crypto from 'crypto';

import cryptoJs from 'crypto-js';

export function hash(password) {
  return argon2.hash(password);
}

export function verifyHash(hash, password) {
  return argon2.verify(hash, password);
}

export function generateKey(size) {
  return crypto.randomBytes(size).toString('hex');
}

export function encrypt(text, key) {
  return cryptoJs.AES.encrypt(text, key).toString();
}

export function decrypt(text, key) {
  return cryptoJs.AES.decrypt(text, key).toString(cryptoJs.enc.Utf8);
}

export function generateUuid() {
  return crypto.randomUUID();
}