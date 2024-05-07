import * as itemService from './itemService.js';

import { db } from '../database/db.js';

export async function clearCartItemsByAccountId(id) {
  return await db.cart_items.destroy({ where: { account_id: id } });
}

export async function isInCartOfAccount(itemId, accountId) {
  return !!await getByItemIdAndAccountId(itemId, accountId);
}

export async function toggle(itemId, accountId) {
  const cartItem = await getByItemIdAndAccountId(itemId, accountId);
  let is_in_cart;
  if (cartItem) {
    is_in_cart = !await deleteById(cartItem.id);
  } else {
    is_in_cart = !!await add(itemId, accountId);
  }
  return { is_in_cart };
}

export async function getByItemIdAndAccountId(itemId, accountId) {
  const cartItem = await db.cart_items.findOne({ where: { item_id: itemId, account_id: accountId } });
  if (!cartItem) return null;
  return getById(cartItem.id);
}

export async function getAllBriefByAccountId(accountId) {
  const cartItems = await db.cart_items.findAll({
    where: { account_id: accountId },
    include: [{ model: db.items, as: 'item', required: true }]
  });
  const items = cartItems.map(cartItem => ({
    id: cartItem.item.id,
    title: cartItem.item.title,
    price: cartItem.item.price,
    quantity: cartItem.item.quantity,
    cart_quantity: cartItem.quantity,
    image: cartItem.item.image,
    is_in_stock: cartItem.item.quantity > 0,
    is_available: cartItem.item.is_available,
  }));
  return items;
}

export async function getCartCostByAccountId(accountId) {
  const cartItems = await db.cart_items.findAll({
    where: { account_id: accountId },
    include: [{ model: db.items, as: 'item', required: true }]
  });
  return cartItems.map(cartItem => cartItem.item.price * cartItem.quantity).reduce((a, b) => a + b, 0);
}

export function deleteById(id) {
  return db.cart_items.destroy({ where: { id: id } });
}

export function deleteByAccountId(accountId) {
  return db.cart_items.destroy({ where: { account_id: accountId } });
}

export async function add(itemId, accountId, quantity = 1) {
  const [cartItem, created] = await db.cart_items.findOrCreate({
    where: { item_id: itemId, account_id: accountId },
    defaults: { item_id: itemId, account_id: accountId, quantity: quantity }
  });
  if (!cartItem) return null;
  return getById(cartItem.id);
}

export async function getById(id) {
  const cartItem = await db.cart_items.findByPk(id);
  return dataValues(cartItem);
}

export async function updateCartItemQuantityByAccountId(itemId, accountId, newCartQuantity) {
  const itemQuantity = (await itemService.getById(itemId)).quantity;
  await db.cart_items.update(
    { quantity: Math.min(itemQuantity, newCartQuantity) },
    { where: { item_id: itemId, account_id: accountId } }
  );
  return getByItemIdAndAccountId(itemId, accountId);
}

export function deleteByItemIdAndAccountId(itemId, accountId) {
  return db.cart_items.destroy({ where: { item_id: itemId, account_id: accountId } });
}

function dataValues(cartItem) {
  return {
    id: cartItem.id,
    item_id: cartItem.item_id,
    account_id: cartItem.account_id,
    quantity: cartItem.quantity
  };
}