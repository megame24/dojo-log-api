"use strict";
const { Model } = require("sequelize");

// INCLUDE UPDATED BY!!!!

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      Log.belongsTo(models.Logbook, { foreignKey: "logbookId" });
      Log.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Log.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      logbookId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      durationOfWork: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proofOfWorkImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Log",
    }
  );
  return Log;
};
