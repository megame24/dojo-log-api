"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LogbookNotification extends Model {
    static associate(models) {
      LogbookNotification.belongsTo(models.Logbook, {
        foreignKey: "logbookId",
        onDelete: "cascade",
      });
    }
  }
  LogbookNotification.init(
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
      title: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      body: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      days: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      hour: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "LogbookNotification",
      indexes: [
        {
          name: "notification_logbookId",
          fields: ["logbookId"],
        },
      ],
    }
  );
  return LogbookNotification;
};
