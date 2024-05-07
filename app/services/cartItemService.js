import { db } from '../database/db.js';

export async function clearCartItemsByAccountId(id) {
  return await db.cart_items.destroy({ where: { account_id: id } });
}

export async function isInCartOfAccount(itemId, accountId) {
  return !!await getByItemIdAndAccountId(itemId, accountId);
}


export async function toggle(itemId, accountId) {
  const cartItem = getByItemIdAndAccountId(itemId, accountId);
  let is_in_cart;
  if (cartItem) {
    is_in_cart = !await deleteById(cartItem.id);
  } else {
    is_in_cart = !!add(itemId, accountId);
  }
  return { is_in_cart };
}

export async function getByItemIdAndAccountId(itemId, accountId) {
  const cartItem = await db.cart_items.findOne({ where: { item_id: itemId, account_id: accountId } });
  if (!cartItem) return null;
  return getFullById(cartItem.id);
}

export async function deleteById(id) {
  return db.cart_items.destroy({ where: { id: id } });
}

export async function add(itemId, accountId, quantity = 1) {
  const cartItem = await db.cart_items.findOrCreate({
    where: { item_id: itemId, account_id: accountId },
    defaults: { item_id: itemId, account_id: accountId, quantity: quantity }
  });
  if (!cartItem) return null;
  return getFullById(cartItem.id);
}

async function getFullById(id) {
  const favItem = await db.favourite_items.findByPk(id);
  return dataValues(favItem);
}

function dataValues(cartItem) {
  return {
    id: cartItem.id,
    item_id: cartItem.item_id,
    account_id: cartItem.account_id,
    quantity: cartItem.quantity
  };
}