import { Op } from 'sequelize';
import { db } from '../database/db.js';

export async function create(title, description, rules, price, quantity, category, image, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available) {
  const item = await db.items.create({ title, description, rules, price, quantity, category, image, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available });
  if (!item) return null;
  return getById(item.id);
}

export async function getById(id) {
  const item = await db.items.findByPk(id);
  if (!item) return null;
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    rules: item.rules,
    price: item.price,
    quantity: item.quantity,
    category: item.category,
    image: item.image,
    publisher: item.publisher,
    year: item.year,
    min_players: item.min_players,
    max_players: item.max_players,
    avg_play_time: item.avg_play_time,
    player_min_age: item.player_min_age,
    is_available: item.is_available,
  };
}

export async function getAllBriefWithFilter(title, publisher, in_stock, category, ordering) {
  const whereStatement = {};
  if (title?.length > 0) whereStatement.title = { [Op.like]: `${title?.trim()}%` };
  if (publisher?.length > 0) whereStatement.publisher = { [Op.like]: `%${publisher?.trim()}%` };
  if (in_stock) {
    whereStatement.is_available = true;
    whereStatement.quantity = { [Op.gt]: 0, };
  }
  if (category?.length > 0) whereStatement.category = { [Op.like]: `%${category?.trim()}%` };
  const orderStatement = [];
  switch (ordering) {
    case process.env.DATABASE_CATALOG_ITEMS_ORDERING_LAST_ADDED_TITLE:
      orderStatement.push(['id', 'DESC']);
      break;
    case process.env.DATABASE_CATALOG_ITEMS_ORDERING_PRICE_ASC_TITLE:
      orderStatement.push(['price', 'ASC']);
      orderStatement.push(['title', 'ASC']);
      break;
    case process.env.DATABASE_CATALOG_ITEMS_ORDERING_PRICE_DESC_TITLE:
      orderStatement.push(['price', 'DESC']);
      orderStatement.push(['title', 'ASC']);
      break;
  }
  return (await db.items.findAll({ where: whereStatement, order: orderStatement })).map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    is_in_stock: item.quantity > 0,
    is_available: item.is_available,
  }));
}

export async function updateById(itemId, title, description, rules, price, quantity, category, image, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available) {
  const updateStatement = {};
  updateStatement.title = title || undefined;
  updateStatement.description = description || undefined;
  updateStatement.rules = rules || undefined;
  updateStatement.price = price || undefined;
  updateStatement.quantity = quantity || undefined;
  updateStatement.category = category || undefined;
  updateStatement.image = image || undefined;
  updateStatement.publisher = publisher || undefined;
  updateStatement.year = year || undefined;
  updateStatement.min_players = min_players || undefined;
  updateStatement.max_players = max_players || undefined;
  updateStatement.avg_play_time = avg_play_time || undefined;
  updateStatement.player_min_age = player_min_age || undefined;
  updateStatement.is_available = is_available || false;
  if (!await db.items.update(
    updateStatement,
    { where: { id: itemId } }
  )) {
    return null;
  }
  return getById(itemId);
}