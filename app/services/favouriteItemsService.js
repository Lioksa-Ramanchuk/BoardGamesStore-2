import { db } from '../database/db.js';

export async function clearFavouriteItemsByAccountId(id) {
  return await db.favourite_items.destroy({ where: { account_id: id } });
}