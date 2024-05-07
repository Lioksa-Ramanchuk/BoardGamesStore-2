import * as Role from '../security/role.js';
import * as cryptoService from './cryptoService.js';
import * as keyService from './keyService.js';

import { clearCartItemsByAccountId } from './cartItemService.js';
import { clearFavouriteItemsByAccountId } from './favouriteItemService.js';
import { db } from '../database/db.js';

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
  return getFullById(account.id);
}

export async function createAdmin(login, password, fullname, email) {
  return create(login, password, fullname, email, Role.Admin);
}

export async function getByLogin(login) {
  const account = await db.accounts.findOne({ where: { login: login } });
  if (!account) return null;
  return getFullById(account.id);
}

export async function verifyPassword(id, password) {
  const account = await db.accounts.findByPk(id);
  if (!account) return null;
  return cryptoService.verifyHash(account.password, password);
}

export async function getFullById(id) {
  const account = await db.accounts.findByPk(id, {
    include: [
      { model: db.roles, required: true, as: 'role' },
      { model: db.clients, as: 'client' }
    ]
  });
  if (!account) return null;
  return dataValues(account);
}

export async function activateById(id) {
  const account = await db.accounts.findByPk(id);
  if (!account) return null;
  account.is_active = true;
  await account.save();
  return getFullById(account.id);
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
  return getFullById(account.id);
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
  return getFullById(account.id);
}

async function dataValues(account) {
  const key = await keyService.getAccountKey(account.id);
  return {
    id: account.id,
    role_id: account.role_id,
    role: account.role && { id: account.role.id, title: account.role.title },
    login: account.login,
    fullname: cryptoService.decrypt(account.fullname, key),
    email: cryptoService.decrypt(account.email, key),
    is_active: account.is_active,
    client: account.client && { address: cryptoService.decrypt(account.client.address, key) } || null,
  };
}