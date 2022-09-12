"use strict";
const { goals } = require("./config/seedData");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Goals", goals);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Goals", null, {});
  },
};
