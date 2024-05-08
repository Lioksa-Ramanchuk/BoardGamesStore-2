import * as cryptoService from './cryptoService.js';
import * as keyService from './keyService.js';
import * as orderStatusService from './orderStatusService.js';

import { db } from '../database/db.js';

export async function create(accountId, orderComment, clientFullname, clientEmail, clientAddress) {
  const statusId = (await db.order_statuses.findOne({ where: { title: process.env.DATABASE_PROCESSING_ORDER_STATUS_TITLE } })).id;
  const key = await keyService.getAccountKey(accountId);
  const order = await db.orders.create({
    account_id: accountId,
    code: generateOrderCode(),
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
  return dataValues(await db.orders.findByPk(id, {
    include: [
      { model: db.order_statuses, as: 'status', required: true }
    ]
  }));
}

export function generateOrderCode() {
  const part1 = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const part2 = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  return `${part1}-${part2}`;
}

export async function getAllBrief() {
  return (await db.orders.findAll({
    include: [
      { model: db.order_statuses, as: 'status', required: true }
    ]
  })).map(order => ({
    id: order.id,
    account_id: order.account_id,
    code: order.code,
    date: order.order_date,
    status_id: order.status_id,
    status: order.status?.title,
  }));
}

export async function getOrderCost(orderId) {
  const orderedItems = await db.ordered_items.findAll({ where: { order_id: orderId } });
  return orderedItems.map(orderedItem => orderedItem.price * orderedItem.quantity).reduce((a, b) => a + b, 0);
}

export async function setOrderStatusByTitle(orderId, newTitle) {
  const status = await orderStatusService.getByTitle(newTitle);
  return await db.orders.update({ status_id: status.id }, { where: { id: orderId } });
}

async function dataValues(order) {
  const key = await keyService.getAccountKey(order.account_id);
  return {
    id: order.id,
    account_id: order.account_id,
    code: order.code,
    order_date: order.order_date,
    status_id: order.status_id,
    status: order.status?.title,
    order_cost: await getOrderCost(order.id),
    order_comment: cryptoService.decrypt(order.order_comment, key),
    client_fullname: cryptoService.decrypt(order.client_fullname, key),
    client_email: cryptoService.decrypt(order.client_email, key),
    client_address: cryptoService.decrypt(order.client_address, key),
  };
}