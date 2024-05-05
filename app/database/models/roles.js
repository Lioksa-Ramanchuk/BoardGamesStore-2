import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class roles extends Model {
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
      unique: "UQ__roles__E52A1BB3D7E195E0"
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__roles__3213E83F91CE23B4",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__roles__E52A1BB3D7E195E0",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
