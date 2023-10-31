const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "emanuel555",
  database: "bd_fenix",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
