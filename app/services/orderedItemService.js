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

export async function getAllBriefByOrderId(orderId) {
  const orderItems = await db.ordered_items.findAll({
    where: { order_id: orderId },
    include: [{ model: db.items, as: 'item', required: true }]
  });
  return orderItems.map(orderedItem => dataValues(orderedItem));
}

function dataValues(orderedItem) {
  return {
    id: orderedItem.id,
    order_id: orderedItem.order_id,
    item_id: orderedItem.item_id,
    price: orderedItem.price,
    quantity: orderedItem.quantity,
    title: orderedItem.item?.title,
    image: orderedItem.item?.image,
  };
}