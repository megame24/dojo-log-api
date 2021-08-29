"use strict";
const { Model } = require("sequelize");
const { LogbookVisibility } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.Logbook, { foreignKey: "logbookId" });
      Goal.belongsTo(models.User, { foreignKey: "userId" });
      Goal.belongsToMany(models.Reward, { through: "GoalRewards" });
    }
  }
  Goal.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      achieved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      achievementCriteria: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM(LogbookVisibility),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Goal",
    }
  );
  return Goal;
};
