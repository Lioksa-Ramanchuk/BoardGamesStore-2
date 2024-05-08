import { db } from '../database/db.js';

export async function getAll() {
  return (await db.order_statuses.findAll()).map(status => dataValues(status));
}

export async function getByTitle(title) {
  return dataValues(await db.order_statuses.findOne({ where: { title } }));
}

function dataValues(status) {
  return {
    id: status.id,
    title: status.title,
  };
}