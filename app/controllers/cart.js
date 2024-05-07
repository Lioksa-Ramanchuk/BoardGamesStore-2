import * as cartItemService from '../services/cartItemService.js';
import * as favouriteItemService from '../services/favouriteItemService.js';
import * as itemService from '../services/itemService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetCartItems(req, res, next) {
  let items = await cartItemService.getAllBriefByAccountId(req.account.id);
  items = await Promise.all(items.map(async item => {
    item.is_in_favs = await favouriteItemService.isInFavouritesOfAccount(item.id, req.account.id);
    return item;
  }));
  return res.json(items);
}
export async function handleGetCartCost(req, res, next) {
  return res.json({ cart_cost: await cartItemService.getCartCostByAccountId(req.account.id) });
}
export async function handleClearCart(req, res, next) {
  await cartItemService.deleteByAccountId(req.account.id);
  return res.status(StatusCodes.OK).send('Кошык ачышчаны.');
}
export async function handleValidateCart(req, res, next) {
  let errorMsg = 'Нельга аформіць заказ!';
  const items = await cartItemService.getAllBriefByAccountId(req.account.id);
  if (!items.length) {
    errorMsg += `\nКошык пусты!`;
    return res.status(StatusCodes.BAD_REQUEST).send(errorMsg);
  }
  const notAvailableItems = [];
  const notEnoughInStockItems = [];
  items.forEach(item => {
    if (!item.is_available) {
      notAvailableItems.push(item);
      return;
    }
    if (item.cart_quantity > item.quantity) {
      notEnoughInStockItems.push(item);
      return;
    }
  });
  let cartIsValid = true;
  if (notAvailableItems.length > 0) {
    cartIsValid = false;
    errorMsg += `\nНедаступныя тавары: ${notAvailableItems.map(item => `"${item.title}"`).join(', ')}.`;
  }
  if (notEnoughInStockItems.length > 0) {
    cartIsValid = false;
    errorMsg += `\nТавараў не хапае ў наяўнасці: ${notEnoughInStockItems.map(item => `"${item.title}" (на складзе: ${item.quantity})`).join(', ')}.`;
  }
  return cartIsValid
    ? res.status(StatusCodes.OK).send('Кошык валідны.')
    : res.status(StatusCodes.BAD_REQUEST).send(errorMsg);
}
export async function handleUpdateCartItemQuantity(req, res, next) {
  const { item_id, cart_quantity } = req.body;
  let new_cart_quantity;
  if (cart_quantity > 0) {
    const item = await cartItemService.updateCartItemQuantityByAccountId(item_id, req.account.id, cart_quantity);
    new_cart_quantity = item.quantity;
  } else {
    await cartItemService.deleteByItemIdAndAccountId(item_id, req.account.id);
    new_cart_quantity = 0;
  }
  return res.json({ new_cart_quantity });
}