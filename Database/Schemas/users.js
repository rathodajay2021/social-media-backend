"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ post_data, friends, likes, comments }) {
      // define association here
      this.hasMany(post_data, { foreignKey: "userId" });

      this.hasMany(friends, { as: "userOne", foreignKey: "senderId" });
      this.hasMany(friends, { as: "userTwo", foreignKey: "receiverId" });

      this.hasMany(likes, { foreignKey: "userId" });

      this.hasMany(comments, { foreignKey: "userId" });
    }
  }
  users.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: DataTypes.TEXT("long"),
      dob: DataTypes.DATE,
      profilePic: {
        type: DataTypes.STRING,
      },
      coverPic: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
