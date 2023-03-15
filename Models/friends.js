"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users }) {
      // define association here
      this.belongsTo(users, {
        as: "userOne",
        foreignKey: "userId1",
        onDelete: "CASCADE",
      });
      this.belongsTo(users, {
        as: "userTwo",
        foreignKey: "userId2",
        onDelete: "CASCADE",
      });
    }
  }
  friends.init(
    {
      userId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
    },
    {
      sequelize,
      modelName: "friends",
    }
  );
  return friends;
};
