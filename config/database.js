const Sequelize = require("sequelize");
module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.U_NAME,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
