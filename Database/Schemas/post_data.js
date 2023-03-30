"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users, postMedia, likes, comments }) {
      // define association here
      this.belongsTo(users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      this.hasMany(postMedia, { foreignKey: "postId" });

      this.hasMany(likes, { foreignKey: "postId" });
      
      this.hasMany(comments, { foreignKey: "postId" });
    }
  }
  post_data.init(
    {
      description: DataTypes.TEXT('long'),
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
    },
    {
      sequelize,
      modelName: "post_data",
    }
  );
  return post_data;
};
