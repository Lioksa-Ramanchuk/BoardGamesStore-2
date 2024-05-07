import _accounts from "./accounts.js";
import _cart_items from "./cart_items.js";
import _clients from "./clients.js";
import _favourite_items from "./favourite_items.js";
import _items from "./items.js";
import _order_statuses from "./order_statuses.js";
import _ordered_items from "./ordered_items.js";
import _orders from "./orders.js";
import _roles from "./roles.js";
import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;

export default function initModels(sequelize) {
  const accounts = _accounts.init(sequelize, DataTypes);
  const cart_items = _cart_items.init(sequelize, DataTypes);
  const clients = _clients.init(sequelize, DataTypes);
  const favourite_items = _favourite_items.init(sequelize, DataTypes);
  const items = _items.init(sequelize, DataTypes);
  const order_statuses = _order_statuses.init(sequelize, DataTypes);
  const ordered_items = _ordered_items.init(sequelize, DataTypes);
  const orders = _orders.init(sequelize, DataTypes);
  const roles = _roles.init(sequelize, DataTypes);

  cart_items.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(cart_items, { as: "cart_items", foreignKey: "account_id" });
  clients.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasOne(clients, { as: "client", foreignKey: "account_id" });
  favourite_items.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(favourite_items, { as: "favourite_items", foreignKey: "account_id" });
  orders.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(orders, { as: "orders", foreignKey: "account_id" });
  cart_items.belongsTo(items, { as: "item", foreignKey: "item_id" });
  items.hasMany(cart_items, { as: "cart_items", foreignKey: "item_id" });
  favourite_items.belongsTo(items, { as: "item", foreignKey: "item_id" });
  items.hasMany(favourite_items, { as: "favourite_items", foreignKey: "item_id" });
  ordered_items.belongsTo(items, { as: "item", foreignKey: "item_id" });
  items.hasMany(ordered_items, { as: "ordered_items", foreignKey: "item_id" });
  orders.belongsTo(order_statuses, { as: "status", foreignKey: "status_id" });
  order_statuses.hasMany(orders, { as: "orders", foreignKey: "status_id" });
  ordered_items.belongsTo(orders, { as: "order", foreignKey: "order_id" });
  orders.hasMany(ordered_items, { as: "ordered_items", foreignKey: "order_id" });
  accounts.belongsTo(roles, { as: "role", foreignKey: "role_id" });
  roles.hasMany(accounts, { as: "accounts", foreignKey: "role_id" });

  return {
    accounts,
    cart_items,
    clients,
    favourite_items,
    items,
    order_statuses,
    ordered_items,
    orders,
    roles,
  };
}
