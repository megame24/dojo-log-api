"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GoalNotification extends Model {
    static associate(models) {
      GoalNotification.belongsTo(models.Goal, {
        foreignKey: "goalId",
        onDelete: "cascade",
      });
    }
  }
  GoalNotification.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      goalId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      notificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GoalNotification",
      indexes: [
        {
          name: "goal_id_index",
          fields: ["goalId"],
        },
        {
          name: "notification_date_index",
          fields: ["notificationDate"],
        },
      ],
    }
  );
  return GoalNotification;
};
