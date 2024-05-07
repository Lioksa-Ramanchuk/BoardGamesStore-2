import * as accountService from '../services/accountService.js';
import * as clientService from '../services/clientService.js';
import * as cookieService from '../services/cookieService.js';
import * as cryptoService from '../services/cryptoService.js';
import * as jwtService from '../services/jwtService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetAccountInfo(req, res, next) {
  const account = await accountService.getFulById(req.account.id);
  return res.json(account);
}

export async function handleSignIn(req, res, next) {
  const { login, password } = req.body;

  const account = await accountService.getByLogin(login);
  if (!account || !await accountService.verifyPassword(account.id, password)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Няправільны лагін ці пароль!');
  }
  if (!account.is_active) {
    return res.status(StatusCodes.ACCEPTED).send('Аднавіць акаўнт?');
  }
  const accountUuid = cryptoService.generateUuid();
  const accessToken = jwtService.generateAccessToken(account.id, account.role.title, accountUuid);
  const refreshToken = jwtService.generateRefreshToken(account.id, account.role.title, accountUuid);
  await jwtService.storeRefreshToken(accountUuid, refreshToken);
  cookieService.setAccessToken(res, accessToken);
  cookieService.setRefreshToken(res, refreshToken);
  return res.status(StatusCodes.OK).end('Уваход у акаўнт выкананы паспяхова.');
}

export async function handleSignUp(req, res, next) {
  const { login, password, fullname, email, address } = req.body;

  if (await accountService.getByLogin(login)) {
    return res.status(StatusCodes.CONFLICT).send('Такі лагін ужо ёсць!');
  }
  const clientAccount = await clientService.createClient(login, password, fullname, email, address);
  const accountUuid = cryptoService.generateUuid();
  const accessToken = jwtService.generateAccessToken(clientAccount.id, clientAccount.role.title, accountUuid);
  const refreshToken = jwtService.generateRefreshToken(clientAccount.id, clientAccount.role.title, accountUuid);
  await jwtService.storeRefreshToken(accountUuid, refreshToken);
  cookieService.setAccessToken(res, accessToken);
  cookieService.setRefreshToken(res, refreshToken);
  return res.status(StatusCodes.OK).send('Рэгістрацыя выкананая паспяхова.');
}

export function handleSignOut(req, res, next) {
  cookieService.clearAccessToken(res);
  cookieService.clearRefreshToken(res);
  return res.status(StatusCodes.OK).send('Выхад з акаўнта выкананы паспяхова.');
}

export async function handleUpdateAccountInfo(req, res, next) {
  const { login, password, fullname, email } = req.body;
  await accountService.updateById(req.account.id, login, password, fullname, email);
  return res.status(StatusCodes.OK).send('Звесткі акаўнта абноўленыя паспяхова.');
}

export async function handleUpdateClientAccountInfo(req, res, next) {
  const { address } = req.body;
  await clientService.updateByAccountId(req.account.id, address);
  return res.status(StatusCodes.OK).send('Кліенцкія звесткі абноўленыя паспяхова.');
}
export async function handleCreateNewAdminAccount(req, res, next) {
  const { login, password, fullname, email } = req.body;

  if (await accountService.getByLogin(login)) {
    return res.status(StatusCodes.CONFLICT).send('Такі лагін ужо ёсць!');
  }
  const admin = await accountService.createAdmin(login, password, fullname, email);
  return res.status(StatusCodes.OK).send(`Новы адміністратар ${admin.fullname} дададзены паспяхова.`);
}

export async function handleDeactivateAccount(req, res, next) {
  await accountService.deactivateById(req.account.id);
  //return res.redirect('/account/api/sign-out', StatusCodes.TEMPORARY_REDIRECT);
  cookieService.clearAccessToken(res);
  cookieService.clearRefreshToken(res);
  return res.status(StatusCodes.OK).send('Акаўнт дэактывіяваны паспяхова.');
}

export async function handleReactivateAccount(req, res, next) {
  const { login, password } = req.body;

  const account = await accountService.getByLogin(login);
  if (!account || !await accountService.verifyPassword(account.id, password)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Няправільны лагін ці пароль!');
  }
  if (!account.is_active) {
    await accountService.activateById(account.id);
  }
  //return res.redirect('/account/api/sign-in', StatusCodes.TEMPORARY_REDIRECT);
  const accountUuid = cryptoService.generateUuid();
  const accessToken = jwtService.generateAccessToken(account.id, account.role.title, accountUuid);
  const refreshToken = jwtService.generateRefreshToken(account.id, account.role.title, accountUuid);
  await jwtService.storeRefreshToken(accountUuid, refreshToken);
  cookieService.setAccessToken(res, accessToken);
  cookieService.setRefreshToken(res, refreshToken);
  return res.status(StatusCodes.OK).send('Акаўнт адноўлены паспяхова.');
}