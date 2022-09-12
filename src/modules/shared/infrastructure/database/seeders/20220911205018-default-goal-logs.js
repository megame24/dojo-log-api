"use strict";
const { logs } = require("./config/seedData");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Logs", logs);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Logs", null, {});
  },
};
