import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class items extends Model {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_players: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avg_play_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    player_min_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'items',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__items__3213E83F85B79754",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
