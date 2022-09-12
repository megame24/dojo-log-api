"use strict";
const { logbooks } = require("./config/seedData");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Logbooks", logbooks);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Logbooks", null, {});
  },
};
