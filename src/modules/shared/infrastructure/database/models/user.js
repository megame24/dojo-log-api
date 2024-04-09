"use strict";

const { Model } = require("sequelize");
const { Role } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.PersistentToken, { foreignKey: "userId" });
      User.hasMany(models.Logbook, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
      User.hasMany(models.Logbook, {
        foreignKey: "updatedBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.Logbook, {
        foreignKey: "createdBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.Log, { foreignKey: "userId", onDelete: "cascade" });
      User.hasMany(models.Log, {
        foreignKey: "updatedBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.Log, {
        foreignKey: "createdBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.Goal, { foreignKey: "userId", onDelete: "cascade" });
      User.hasMany(models.Goal, {
        foreignKey: "updatedBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.Goal, {
        foreignKey: "createdBy",
        onDelete: "SET NULL",
      });
      User.hasMany(models.File, { foreignKey: "userId", onDelete: "cascade" });
      User.hasMany(models.ExpoNotificationToken, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM(Role),
        allowNull: false,
        defaultValue: Role.USER,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
