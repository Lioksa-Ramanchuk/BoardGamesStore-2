import * as redisService from './redisService.js';

import jsonwebtoken from 'jsonwebtoken';

export function generateAccessToken(accountId, accountRole, accountUuid) {
  return jsonwebtoken.sign({ account: { id: accountId, role: accountRole, uuid: accountUuid } }, process.env.JWT_SECRET, { expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN * 1000 });
}
export function verifyAccessToken(accessToken) {
  return verifyToken(accessToken, process.env.JWT_SECRET);
}

export function generateRefreshToken(accountId, accountRole, accountUuid) {
  return jsonwebtoken.sign({ account: { id: accountId, role: accountRole, uuid: accountUuid } }, process.env.JWT_REFRESH_SECRET, { expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN * 1000 });
}
export async function storeRefreshToken(accountUuid, refreshToken) {
  return redisService.set(`refreshToken:${accountUuid}`, refreshToken, 'EX', +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN);
}
export async function getRefreshToken(accountUuid) {
  return redisService.get(`refreshToken:${accountUuid}`);
}
export function verifyRefreshToken(refreshToken) {
  return verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
}

function verifyToken(token, secret) {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (err) {
    return null;
  }
}