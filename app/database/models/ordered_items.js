import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ordered_items extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
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
    price: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ordered_items',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ordered___3213E83F7D5D1D37",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
