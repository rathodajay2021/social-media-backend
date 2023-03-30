"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ post_data, users }) {
      // define association here
      this.belongsTo(post_data, {
        foreignKey: "postId",
        onDelete: "CASCADE",
      });

      this.belongsTo(users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  likes.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
    },
    {
      sequelize,
      modelName: "likes",
    }
  );

  likes.removeAttribute("id");
  return likes;
};
