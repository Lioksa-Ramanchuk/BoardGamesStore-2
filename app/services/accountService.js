import * as Role from '../security/role.js';
import * as cryptoService from './cryptoService.js';
import * as keyService from './keyService.js';

import { clearCartItemsByAccountId } from './cartItemsService.js';
import { clearFavouriteItemsByAccountId } from './favouriteItemsService.js';
import { db } from '../database/db.js';
import e from 'express';

export async function create(login, password, fullname, email, roleTitle) {
  const key = keyService.generateAccountKey();
  password = await cryptoService.hash(password);
  fullname = cryptoService.encrypt(fullname, key);
  email = cryptoService.encrypt(email, key);
  const adminRoleId = (await db.roles.findOne({ where: { title: roleTitle } })).id;
  const account = await db.accounts.create({
    role_id: adminRoleId, login, password, fullname, email,
  });
  if (!account) return null;
  await keyService.storeAccountKey(account.id, key);
  return getById(account.id);
}

export async function createAdmin(login, password, fullname, email) {
  return create(login, password, fullname, email, Role.Admin);
}

export async function getByLogin(login) {
  const account = await db.accounts.findOne({ where: { login: login } });
  if (!account) return null;
  return getById(account.id);
}

export async function verifyPassword(id, password) {
  const account = await db.accounts.findByPk(id);
  if (!account) return null;
  return cryptoService.verifyHash(account.password, password);
}

export async function getById(id) {
  const account = await db.accounts.findByPk(id, {
    include: [
      { model: db.roles, required: true, as: 'role' },
      { model: db.clients, as: 'client' }
    ]
  });
  if (!account) return null;
  delete account.save;
  const key = await keyService.getAccountKey(account.id);
  account.fullname = cryptoService.decrypt(account.fullname, key);
  account.email = cryptoService.decrypt(account.email, key);
  if (account.client) {
    account.client.address = cryptoService.decrypt(account.client.address, key);
  }
  return account;
}

export async function activateById(id) {
  const account = await db.accounts.findByPk(id);
  if (!account) return null;
  account.is_active = true;
  await account.save();
  return getById(id);
}

export async function deactivateById(id) {
  const account = await db.accounts.findByPk(id, {
    include: [
      { model: db.roles, required: true, as: 'role' },
    ]
  });
  if (!account) return null;
  account.is_active = false;
  await account.save();
  if (account.role.title === Role.Client) {
    await clearCartItemsByAccountId(account.id);
    await clearFavouriteItemsByAccountId(account.id);
  }
  return getById(id);
}

export async function updateById(id, login, password, fullname, email) {
  const account = await db.accounts.findByPk(id);
  if (!account) return null;
  const key = await keyService.getAccountKey(id);
  account.login = login || account.login;
  account.password = password && await cryptoService.hash(password) || account.password;
  account.fullname = fullname && cryptoService.encrypt(fullname, key) || account.fullname;
  account.email = email && cryptoService.encrypt(email, key) || account.email;
  account.save();
  return getById(id);
}