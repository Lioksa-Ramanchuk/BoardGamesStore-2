import * as accountService from '../services/accountService.js';
import * as cartItemService from '../services/cartItemService.js';
import * as orderService from '../services/orderService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetClientAddress(req, res, next) {
  return res.json({ client_address: (await accountService.getFullById(req.account.id))?.client?.address });
}

export async function handleMakeOrder(req, res, next) {
  const { client_address, comment } = req.body;

  const cartItems = (await cartItemService.getAllBriefByAccountId(req.account.id))
    .filter(cartItem => cartItem.is_available && cartItem.is_in_stock && cartItem.cart_quantity <= cartItem.quantity);
  if (!cartItems.length) {
    return res.status(StatusCodes.BAD_REQUEST).send('У кошыку няма даступных тавараў для заказа.');
  }
  const account = await accountService.getFullById(req.account.id);
  const order = await orderService.create(req.account.id, comment, account.fullname, account.email, client_address);
  await cartItemService.moveCartItemsToOrderedItemsByOrderId(order.id);
  return res.status(StatusCodes.CREATED).send(`Заказ аформлены паспяхова!\nКод заказа: ${order.code}`);
}