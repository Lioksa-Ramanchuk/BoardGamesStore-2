import * as Role from '../security/role.js';
import * as accountService from './accountService.js';
import * as cryptoService from './cryptoService.js';
import * as keyService from './keyService.js';

import { db } from '../database/db.js';

export async function createClient(login, password, fullname, email, address) {
  const account = await accountService.create(login, password, fullname, email, Role.Client);
  const key = await keyService.getAccountKey(account.id);
  await db.clients.create({
    account_id: account.id,
    address: cryptoService.encrypt(address, key),
  });
  return accountService.getById(account.id);
}

export async function updateByAccountId(accountId, address) {
  const client = await db.clients.findOne({ where: { account_id: id } });
  if (!client) return null;
  const key = await keyService.getAccountKey(id);
  client.address = address && cryptoService.encrypt(address, key) || client.address;
  client.save();
  return accountService.getById(accountId);
}