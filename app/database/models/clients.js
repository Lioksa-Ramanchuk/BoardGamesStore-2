import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class clients extends Model {
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
      },
      unique: "UQ__clients__46A222CC094CD4F6"
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clients',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__clients__3213E83FF52591F9",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__clients__46A222CC094CD4F6",
        unique: true,
        fields: [
          { name: "account_id" },
        ]
      },
    ]
  });
  }
}
