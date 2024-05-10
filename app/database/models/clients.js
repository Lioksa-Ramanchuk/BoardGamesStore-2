import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

// Асабістыя звесткі кліентаў
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
        unique: "UQ__clients__46A222CC6F2F2EA9"
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
          name: "PK__clients__3213E83F748B831D",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "UQ__clients__46A222CC6F2F2EA9",
          unique: true,
          fields: [
            { name: "account_id" },
          ]
        },
      ]
    });
  }
}
