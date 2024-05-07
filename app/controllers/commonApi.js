import * as cartItemService from '../services/cartItemService.js';
import * as favouriteItemService from '../services/favouriteItemService.js';
import * as itemService from '../services/itemService.js';

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