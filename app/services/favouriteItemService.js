import { Op } from 'sequelize';
import { db } from '../database/db.js';

export async function clearFavouriteItemsByAccountId(id) {
  return db.favourite_items.destroy({ where: { account_id: id } });
}

export async function isInFavouritesOfAccount(itemId, accountId) {
  return !!await getByItemIdAndAccountId(itemId, accountId);
}

export async function toggle(itemId, accountId) {
  const favItem = await getByItemIdAndAccountId(itemId, accountId);
  let is_in_favs;
  if (favItem) {
    is_in_favs = !await deleteById(favItem.id);
  } else {
    is_in_favs = !!await add(itemId, accountId);
  }
  return { is_in_favs };
}

export async function getByItemIdAndAccountId(itemId, accountId) {
  const favItem = await db.favourite_items.findOne({ where: { item_id: itemId, account_id: accountId } });
  if (!favItem) return null;
  return getFullById(favItem.id);
}

export async function getAllBriefByAccountId(accountId) {
  const favItems = await db.favourite_items.findAll({
    where: { account_id: accountId },
    include: [{ model: db.items, as: 'item', required: true }]
  });
  const items = favItems.map(favItem => ({
    id: favItem.item.id,
    title: favItem.item.title,
    price: favItem.item.price,
    image: favItem.item.image,
    is_in_stock: favItem.item.quantity > 0,
    is_available: favItem.item.is_available,
  }));
  return items;
}

export async function deleteById(id) {
  return db.favourite_items.destroy({ where: { id: id } });
}

export async function deleteByAccountId(accountId) {
  return db.favourite_items.destroy({ where: { account_id: accountId } });
}

export async function moveAllToCartByAccountId(accountId) {
  const favItemsToMove = await db.favourite_items.findAll({
    where: { account_id: accountId },
    include: [{
      model: db.items, as: 'item', required: true,
      where: { is_available: true, quantity: { [Op.gt]: 0 } }
    }]
  });
  await Promise.all(favItemsToMove.map(async favItem => {
    await db.cart_items.findOrCreate({
      where: { item_id: favItem.item.id, account_id: accountId },
      defaults: { item_id: favItem.item.id, account_id: accountId, quantity: 1 }
    });
    await db.favourite_items.destroy({ where: { id: favItem.id } });
  }));
}

export async function add(itemId, accountId) {
  const [favItem, created] = await db.favourite_items.findOrCreate({
    where: { item_id: itemId, account_id: accountId },
    defaults: { item_id: itemId, account_id: accountId }
  });
  if (!favItem) return null;
  return getFullById(favItem.id);
}

export async function getFullById(id) {
  const favItem = await db.favourite_items.findByPk(id);
  return dataValues(favItem);
}

function dataValues(favItem) {
  return {
    id: favItem.id,
    item_id: favItem.item_id,
    account_id: favItem.account_id
  };
}