import * as accountService from '../services/accountService.js';
import * as cartItemService from '../services/cartItemService.js';
import * as orderService from '../services/orderService.js';
import * as orderStatusService from '../services/orderStatusService.js';
import * as orderedItemService from '../services/orderedItemService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetAllOrdersList(req, res, next) {
  const orders = await orderService.getAllBrief();
  return res.json(orders);
}

export async function handleGetClientOrdersList(req, res, next) {
  const orders = (await orderService.getAllBrief()).filter(order => order.account_id === req.account.id);
  return res.json(orders);
}

export async function handleGetOrderInfo(req, res, next) {
  const order = await orderService.getById(req.params.order_id);
  return res.json(order);
}

export async function handleGetOrderStatuses(req, res, next) {
  const orderStatuses = await orderStatusService.getAll();
  return res.json(orderStatuses);
}

export async function handleGetOrderItems(req, res, next) {
  const items = await orderedItemService.getAllBriefByOrderId(req.params.order_id);
  return res.json(items);
}

export async function handleSetOrderStatus(req, res, next) {
  const { order_id, new_title } = req.body;

  await orderService.setOrderStatusByTitle(order_id, new_title);
  return res.status(StatusCodes.OK).send('Статус заказа абноўлены паспяхова!');
}