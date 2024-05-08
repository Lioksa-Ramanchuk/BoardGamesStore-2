import { db } from '../database/db.js';

export async function create(orderId, itemId, price, quantity) {
  const orderedItem = await db.ordered_items.create({
    order_id: orderId,
    item_id: itemId,
    price: price,
    quantity: quantity,
  });
  if (!orderedItem) return null;
  return getById(orderedItem.id);
}

export async function getById(id) {
  return dataValues(await db.ordered_items.findByPk(id));
}

async function dataValues(orderedItem) {
  return {
    id: orderedItem.id,
    order_id: orderedItem.order_id,
    item_id: orderedItem.item_id,
    price: orderedItem.price,
    quantity: orderedItem.quantity,
  };
}