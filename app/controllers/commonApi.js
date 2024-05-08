import * as cartItemService from '../services/cartItemService.js';
import * as favouriteItemService from '../services/favouriteItemService.js';
import * as itemService from '../services/itemService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetItemInfo(req, res, next) {
  const item = await itemService.getById(+req.params.item_id);
  return res.json(item);
}

export async function handleToggleFavouriteItem(req, res, next) {
  const { is_in_favs } = await favouriteItemService.toggle(+req.params.item_id, req.account.id);
  return res.json({ is_in_favs });
}

export async function handleToggleCartItem(req, res, next) {
  const { is_in_cart } = await cartItemService.toggle(+req.params.item_id, req.account.id);
  return res.json({ is_in_cart });
}

export async function handleGetCartCost(req, res, next) {
  return res.json({ cart_cost: await cartItemService.getCartCostByAccountId(req.account.id) });
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