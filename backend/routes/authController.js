const bcrypt = require('bcrypt');
const pool = require('../db');


async function registerAdmin(user, pass, correo) {
  try {
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE user = ?', [user]);
    const [existingCorreo] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    console.log('Usuario Existente:', existingUser);
    console.log('Correo Existente:', existingCorreo);

    if (existingUser.length > 0) {
      return { success: false, message: 'UsuarioExistente' };
    } else if (existingCorreo.length > 0) {
      return { success: false, message: 'CorreoExistente' };
    } else {
      const hashedpass = await bcrypt.hash(pass, 10);
      const rol_id = 1;
      const insertQuery = 'INSERT INTO usuarios (user, pass, correo, rol_id) VALUES (?, ?, ?, ?)';
      await pool.query(insertQuery, [user, hashedpass, correo, rol_id]);

      return { success: true, message: 'Registro exitoso' };
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}




async function findUserByUser(user) {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE user = ?', [user]);

    if (rows.length > 0) {
      return rows[0];
    }

    return null;
  } catch (error) {
    throw error;
  }
}


async function findUserByCorreo(correo) {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length > 0) {
      return rows[0];
    }

    return null;
  } catch (error) {
    throw error;
  }
}

async function updateUserPass(correo, pass) {
  try {
    if (typeof pass !== 'string' || !pass) {
      console.error('Error: La contraseña no es una cadena válida');
      return false;
    }

    const hashedPass = await bcrypt.hash(pass, 10);
    const updateQuery = 'UPDATE usuarios SET pass = ? WHERE correo = ?'; 
    await pool.query(updateQuery, [hashedPass, correo]); 
    return true; 
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return false; 
  }
}

// Ruta para actualizar la contraseña
async function handleForgotPasswordRequest(req, res) {
  try {
    const { correo, pass } = req.body;

    const user = await findUserByCorreo(correo);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const updateResult = await updateUserPass(correo, pass);

    if (updateResult.success) {
      res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito' });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo cambiar la contraseña' });
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al cambiar la contraseña' });
  }
}




module.exports = {
  findUserByUser,
  findUserByCorreo,
  updateUserPass,
  registerAdmin,
  handleForgotPasswordRequest,
};