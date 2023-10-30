const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "bd_fenix",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conexión a MySQL establecida");
});

module.exports = db;
