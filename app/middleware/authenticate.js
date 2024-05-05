import * as Role from '../security/role.js';
import * as cookieService from '../services/cookieService.js';
import * as jwtService from '../services/jwtService.js';

import deepEqual from '../utils/deepEqual.js';

export default async function authenticate(req, res, next) {
  const accessToken = cookieService.getAccessToken(req);
  const decodedAccess = accessToken && jwtService.verifyAccessToken(accessToken);
  if (decodedAccess) {
    req.account = decodedAccess.account;
    return next();
  }
  const refreshToken = cookieService.getRefreshToken(req);
  const decodedRefresh = refreshToken && jwtService.verifyRefreshToken(refreshToken);
  if (decodedRefresh && refreshToken === await jwtService.getRefreshToken(decodedRefresh.account?.uuid)) {
    if (decodedAccess && deepEqual(decodedAccess, decodedRefresh)) {
      req.account = decodedAccess.account;
    } else {
      const { account } = decodedRefresh;
      cookieService.setAccessToken(res, jwtService.generateAccessToken(account.id, account.role, account.uuid));
      req.account = account;
    }
    return next();
  }

  cookieService.clearAccessToken(res);
  cookieService.clearRefreshToken(res);
  req.account = { id: null, role: Role.Guest, uuid: null };
  return next();
}