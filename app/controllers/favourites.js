import * as cartItemService from '../services/cartItemService.js';
import * as favouriteItemService from '../services/favouriteItemService.js';
import * as itemService from '../services/itemService.js';

import { StatusCodes } from 'http-status-codes';

export async function handleGetFavouriteItems(req, res, next) {
  let items = await favouriteItemService.getAllBriefByAccountId(req.account.id);
  items = await Promise.all(items.map(async item => {
    item.is_in_cart = await cartItemService.isInCartOfAccount(item.id, req.account.id);
    return item;
  }));
  return res.json(items);
}
export async function handleMoveFavouritesToCart(req, res, next) {
  await favouriteItemService.moveAllToCartByAccountId(req.account.id);
  return res.status(StatusCodes.OK).send('Абраныя тавары перанесеныя ў кошык паспяхова.');
}
export async function handleClearFavourites(req, res, next) {
  await favouriteItemService.deleteByAccountId(req.account.id);
  return res.status(StatusCodes.OK).send('Абраныя тавары ачышчаныя.');
}