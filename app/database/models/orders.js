import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

// Заказы
export default class orders extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        }
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "UQ__orders__357D4CF976BD4BCB"
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('getutcdate')
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'order_statuses',
          key: 'id'
        }
      },
      order_comment: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      client_fullname: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      client_email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      client_address: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'orders',
      schema: 'dbo',
      timestamps: false,
      indexes: [
        {
          name: "PK__orders__3213E83F5F082ED2",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "UQ__orders__357D4CF976BD4BCB",
          unique: true,
          fields: [
            { name: "code" },
          ]
        },
      ]
    });
  }
}
