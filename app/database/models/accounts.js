import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class accounts extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      login: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "UQ__accounts__7838F27248EAC388"
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      fullname: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'accounts',
      schema: 'dbo',
      timestamps: false,
      indexes: [
        {
          name: "PK__accounts__3213E83F889BC361",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "UQ__accounts__7838F27248EAC388",
          unique: true,
          fields: [
            { name: "login" },
          ]
        },
      ],
      hooks: {
        afterCreate: async (account) => {
          delete account.dataValues.password;
        },
        afterUpdate: (account) => {
          delete account.dataValues.password;
        },
      }
    });
  }
}
