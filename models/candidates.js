const Sequelize = require("sequelize");
const db = require("../config/database");

const candidate = db.define("candidate", {
  name: {
    type: Sequelize.STRING,
  },
  dob: {
    type: Sequelize.DATE,
  },
  country: {
    type: Sequelize.STRING,
  },
  resumePath: {
    type: Sequelize.STRING,
  },
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
});

module.exports = candidate;
