export function setAccessToken(res, accessToken) {
  res.cookie(process.env.COOKIE_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: (+process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000 });
}
export function getAccessToken(req) {
  return req.cookies[process.env.COOKIE_ACCESS_TOKEN_NAME];
}
export function clearAccessToken(res) {
  res.clearCookie(process.env.COOKIE_ACCESS_TOKEN_NAME);
}

export function setRefreshToken(res, refreshToken) {
  res.cookie(process.env.COOKIE_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: (+process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000 });
}
export function getRefreshToken(req) {
  return req.cookies[process.env.COOKIE_REFRESH_TOKEN_NAME];
}
export function clearRefreshToken(res) {
  res.clearCookie(process.env.COOKIE_REFRESH_TOKEN_NAME);
}