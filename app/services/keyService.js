import * as cryptoService from './cryptoService.js';
import * as redisService from './redisService.js';

export function generateAccountKey() {
  return cryptoService.generateKey(+process.env.ACCOUNT_KEY_SIZE);
}

export function storeAccountKey(accountId, key) {
  return redisService.set(`accountKey:${accountId}`, key);
}

export function getAccountKey(accountId) {
  return redisService.get(`accountKey:${accountId}`);
}