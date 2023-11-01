const db = require("../db");


// Controlador para obtener todos los bd_fenix.usuarios
const getUsers = (req, res) => {
  // Consulta SQL para obtener todos los bd_fenix.usuarios
  const sql = "SELECT * FROM bd_fenix.usuarios"
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error al obtener bd_fenix.usuarios:", error);
      res.status(500).json({ error: "Error al obtener bd_fenix.usuarios" });
    } else {
      res.json(results);
    }
  });
};

// Controlador para obtener un usuario por su ID
const getUserById = (req, res) => {
  const userId = req.params.id;

  // Consulta SQL para obtener un usuario por su ID
  const sql = "SELECT * FROM bd_fenix.usuarios WHERE id = ?";
  
  db.query(sql, [userId], (error, result) => {
    if (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error al obtener usuario" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Usuario no encontrado" });
      } else {
        res.json(result[0]);
      }
    }
  });
};

async function getUserBycorreo(correo) {
  try {
    const connection = await createDbConnection(); // Utiliza la función de creación de conexión a la base de datos
    const [rows, fields] = await connection.execute('SELECT * FROM bd_fenix.usuarios WHERE correo = ?', [correo]);
    await connection.end();
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario por correo:', error);
    return null;
  }
}


async function getUserByuser(user) {
  try {
    const connection = await createDbConnection(); // Utiliza la función de creación de conexión a la base de datos
    const [rows, fields] = await connection.execute('SELECT * FROM bd_fenix.usuarios WHERE user = ?', [user]);
    await connection.end();
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario por nombre de usuario:', error);
    return null;
  }
}

// Controlador para crear un nuevo usuario
const createUser = (req, res) => {
  const { user, pass, correo } = req.body;

  // Ejemplo de consulta SQL para crear un nuevo usuario
  const sql = "INSERT INTO bd_fenix.usuarios (user, pass, correo) VALUES (?, ?, ?)";
  const values = [user, pass, correo];
  
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ error: "Error al crear usuario" });
    } else {
      res.json({ message: "Usuario creado exitosamente", userId: result.insertId });
    }
  });
};

// Controlador para actualizar un usuario existente
const updateUser = (req, res) => {
  const userId = req.params.id;
  const { user, pass, correo } = req.body;

  // Consulta SQL para actualizar un usuario por su ID
  const sql = "UPDATE bd_fenix.usuarios SET user = ?, pass = ?, correo = ? WHERE id = ?";
  const values = [user, pass, correo, userId];
  
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ error: "Error al actualizar usuario" });
    } else {
      res.json({ message: "Usuario actualizado exitosamente" });
    }
  });
};

// Controlador para eliminar un usuario por su ID
const deleteUser = (req, res) => {
  const userId = req.params.id;

  // Consulta SQL para eliminar un usuario por su ID
  const sql = "DELETE FROM bd_fenix.usuarios WHERE id = ?";
  
  db.query(sql, [userId], (error, result) => {
    if (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error al eliminar usuario" });
    } else {
      res.json({ message: "Usuario eliminado exitosamente" });
    }
  });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getUserBycorreo, getUserByuser };