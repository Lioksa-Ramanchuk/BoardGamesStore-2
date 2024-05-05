import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class cart_items extends Model {
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
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'cart_items',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__cart_ite__3213E83F9F4562EC",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}