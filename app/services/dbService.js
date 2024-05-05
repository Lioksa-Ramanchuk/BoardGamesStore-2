import * as Role from '../security/role.js';
import * as accountService from './accountService.js';

import { db, sequelize } from '../database/db.js';

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