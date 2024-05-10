import * as Role from '../security/role.js';
import * as accountService from './accountService.js';

import { db, sequelize } from '../database/db.js';

import { Sequelize } from 'sequelize';

export async function connect() {
  return sequelize.authenticate();
}

export async function ensureDefaultRolesExist() {
  const roles = [Role.Guest, Role.Client, Role.Admin];
  await Promise.all(roles.map(async (roleTitle) => {
    await db.roles.findOrCreate({
      where: { title: roleTitle },
      defaults: { title: roleTitle }
    });
  }));
}

export async function ensureDefaultOrderStatusesExist() {
  const orderStatuses = [
    process.env.DATABASE_PROCESSING_ORDER_STATUS_TITLE,
    process.env.DATABASE_DELIVERED_ORDER_STATUS_TITLE,
  ];

  await Promise.all(orderStatuses.map(async (orderStatusTitle) => {
    await db.order_statuses.findOrCreate({
      where: { title: orderStatusTitle },
      defaults: { title: orderStatusTitle }
    });
  }));
}

export async function ensureAdminAccountExist() {
  let adminAccount = await db.accounts.findOne({
    include: [{ model: db.roles, as: 'role', where: { title: Role.Admin } }]
  });
  if (!adminAccount) {
    await accountService.createAdmin(
      process.env.DATABASE_DEFAULT_ADMIN_LOGIN,
      process.env.DATABASE_DEFAULT_ADMIN_PASSWORD,
      process.env.DATABASE_DEFAULT_ADMIN_FULLNAME,
      process.env.DATABASE_DEFAULT_ADMIN_EMAIL
    );
  }
}

export async function executeSelectQuery(query) {
  try {
    if (!isSelectQuery(query)) {
      throw new Error(`Дапушчальныя толькі SELECT-запыты!`);
    }
    const results = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (error) {
    throw new Error(`Failed to execute query: ${error.message}`);
  }
}

function isSelectQuery(query) {
  query = query.replace(/\s+/g, ' ').trim();
  const selectRegex = /^SELECT\b/i;
  const otherStatementsRegex = /\b(UPDATE|DELETE|INSERT|CREATE|ALTER|DROP)\b/i;
  return selectRegex.test(query) && !otherStatementsRegex.test(query);
}