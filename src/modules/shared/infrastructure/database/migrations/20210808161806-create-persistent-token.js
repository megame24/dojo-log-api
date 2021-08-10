"use strict";

const { TokenType } = require("../models/json/enums.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PersistentTokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "Users",
          key: "id",
        },
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM(TokenType),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PersistentTokens");
  },
};
