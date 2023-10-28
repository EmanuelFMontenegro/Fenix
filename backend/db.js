const mysql = require('mysql2/promise'); // Usamos mysql2/promise para la conexión

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bd_fenix',
};

// Crear un pool de conexiones
const pool = mysql.createPool(dbConfig);

// Exporta el pool de conexiones
module.exports = pool;
