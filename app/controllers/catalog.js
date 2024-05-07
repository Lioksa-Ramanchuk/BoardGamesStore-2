import * as cartItemService from '../services/cartItemService.js';
import * as favouriteItemService from '../services/favouriteItemService.js';
import * as itemService from '../services/itemService.js';

export async function handleGetCatalog(req, res, next) {
  const title = decodeURIComponent(req.query.title);
  const publisher = decodeURIComponent(req.query.publisher);
  const in_stock = decodeURIComponent(req.query.in_stock) === 'true';
  const category = decodeURIComponent(req.query.category);
  const ordering = decodeURIComponent(req.query.ordering);

  let items = await itemService.getAllBriefWithFilter(
    title || null,
    publisher || null,
    in_stock || false,
    category || null,
    ordering || process.env.DEFAULT_CATALOG_ITEMS_ORDERING
  );
  items = await Promise.all(items.map(async item => {
    if (req.account.role === process.env.DATABASE_CLIENT_ROLE_TITLE) {
      item.is_in_cart = await cartItemService.isInCartOfAccount(item.id, req.account.id);
      item.is_in_favs = await favouriteItemService.isInFavouritesOfAccount(item.id, req.account.id);
    }
    return item;
  }));
  return res.json(items);
}

export async function handleToggleFavouriteItem(req, res, next) {
  const { is_in_favs } = await favouriteItemService.toggleByItemId(+req.params.item_id);
  return res.json({ is_in_favs });
}

export async function handleToggleCartItem(req, res, next) {
  const { is_in_favs } = await favouriteItemService.toggleByItemId(+req.params.item_id);
  return res.json({ is_in_favs });
}