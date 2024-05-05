import { db } from '../database/db.js';

export async function clearCartItemsByAccountId(id) {
  return await db.cart_items.destroy({ where: { account_id: id } });
}