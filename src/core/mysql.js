const mysql = require('mysql2');
const { DB_ACCOUNT } = require("../../credentials");
const log4js = require("log4js");

const logger = log4js.getLogger("core");

const db = mysql.createConnection({
  host: DB_ACCOUNT.HOST,
  user: DB_ACCOUNT.USERNAME,
  password: DB_ACCOUNT.PASSWORD,
  database: DB_ACCOUNT.DATABASE
});

db.connect((err) => {
  if (err) return logger.error("Fatal error while connecting to the MySQL database: " + err.message);
  logger.info("Connected to the MySQL database !");
});

module.exports = { db };