"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class postMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ post_data }) {
      // define association here

      this.belongsTo(post_data, {
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
    }
  }
  postMedia.init(
    {
      mediaPath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mediaType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
      },
    },
    {
      sequelize,
      modelName: "postMedia",
    }
  );
  return postMedia;
};
