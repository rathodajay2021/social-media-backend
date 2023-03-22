"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
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
  comments.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "comments",
    }
  );
  return comments;
};
