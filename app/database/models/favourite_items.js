import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class favourite_items extends Model {
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
    }
  }, {
    sequelize,
    tableName: 'favourite_items',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__favourit__3213E83FFCBEF5A4",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
