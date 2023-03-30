"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class otp_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  otp_data.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "otp_data",
    }
  );
  return otp_data;
};
