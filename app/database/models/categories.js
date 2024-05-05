import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class categories extends Model {
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
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'categories',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__categori__3213E83F217EC0FF",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
