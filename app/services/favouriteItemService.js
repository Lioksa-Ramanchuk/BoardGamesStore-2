import { db } from '../database/db.js';

export async function clearFavouriteItemsByAccountId(id) {
  return db.favourite_items.destroy({ where: { account_id: id } });
}

export async function isInFavouritesOfAccount(itemId, accountId) {
  return !!await getByItemIdAndAccountId(itemId, accountId);
}

export async function toggle(itemId, accountId) {
  const favItem = getByItemIdAndAccountId(itemId, accountId);
  let is_in_favs;
  if (favItem) {
    is_in_favs = !await deleteById(favItem.id);
  } else {
    is_in_favs = !!add(itemId, accountId);
  }
  return { is_in_favs };
}

export async function getByItemIdAndAccountId(itemId, accountId) {
  const favItem = await db.favourite_items.findOne({ where: { item_id: itemId, account_id: accountId } });
  if (!favItem) return null;
  return getFullById(favItem.id);
}

export async function deleteById(id) {
  return db.favourite_items.destroy({ where: { id: id } });
}

export async function add(itemId, accountId) {
  const favItem = await db.favourite_items.findOrCreate({
    where: { item_id: itemId, account_id: accountId },
    defaults: { item_id: itemId, account_id: accountId }
  });
  if (!favItem) return null;
  return getFullById(favItem.id);
}

async function getFullById(id) {
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