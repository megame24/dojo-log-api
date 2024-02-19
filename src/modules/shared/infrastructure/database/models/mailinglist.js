"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MailingList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MailingList.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      subscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "MailingList",
      indexes: [
        {
          name: "subscribed_index",
          fields: ["subscribed"],
        },
      ],
    }
  );
  return MailingList;
};
