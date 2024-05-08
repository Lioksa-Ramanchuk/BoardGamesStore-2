import * as cryptoService from './cryptoService.js';
import * as keyService from './keyService.js';

import { db } from '../database/db.js';

export async function create(accountId, orderComment, clientFullname, clientEmail, clientAddress) {
  const code = `${new Date().getTime()}-${cryptoService.generateUuid()}`;
  const statusId = (await db.order_statuses.findOne({ where: { title: process.env.DATABASE_PROCESSING_ORDER_STATUS_TITLE } })).id;
  const key = await keyService.getAccountKey(accountId);
  const order = await db.orders.create({
    account_id: accountId,
    code: code,
    status_id: statusId,
    order_comment: cryptoService.encrypt(orderComment, key),
    client_fullname: cryptoService.encrypt(clientFullname, key),
    client_email: cryptoService.encrypt(clientEmail, key),
    client_address: cryptoService.encrypt(clientAddress, key),
  });
  if (!order) return null;
  return getById(order.id);
}

export async function getById(id) {
  return dataValues(await db.orders.findByPk(id));
}

async function dataValues(order) {
  const key = await keyService.getAccountKey(order.account_id);
  return {
    id: order.id,
    account_id: order.account_id,
    code: order.code,
    order_date: order.order_date,
    status_id: order.status_id,
    order_comment: cryptoService.decrypt(order.order_comment, key),
    client_fullname: cryptoService.decrypt(order.client_fullname, key),
    client_email: cryptoService.decrypt(order.client_email, key),
    client_address: cryptoService.decrypt(order.client_address, key),
  };
}