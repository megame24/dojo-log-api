const { sequelize } = require("./models");

sequelize.sync({ logging: console.log, force: false });
