import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class order_statuses extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UQ__order_st__E52A1BB3991DB014"
    }
  }, {
    sequelize,
    tableName: 'order_statuses',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__order_st__3213E83FFC8AB70C",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__order_st__E52A1BB3991DB014",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
