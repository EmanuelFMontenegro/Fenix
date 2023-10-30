const bcrypt = require('bcrypt');
const pool = require('../db');

async function registerAdmin(user, pass, correo) {
  try {
    const existingUserQuery = 'SELECT * FROM usuarios WHERE user = ?';
    const existingCorreoQuery = 'SELECT * FROM usuarios WHERE correo = ?';

    const [existingUser] = await pool.query(existingUserQuery, [user]);
    const [existingCorreo] = await pool.query(existingCorreoQuery, [correo]);
    console.log('Existing User:', existingUser);
    console.log('Existing Correo:', existingCorreo);

    if (existingUser.length > 0) {
      return { success: false, message: 'Usuario Existente' };
    } else if (existingCorreo.length > 0) {
      return { success: false, message: 'Correo Existente' };
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
    const updateQuery = 'UPDATE usuarios SET pass = ? WHERE pass = ?';
    await pool.query(updateQuery, [correo ,pass ]);
    return true;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return false;
  }
}

async function handleForgotPasswordRequest(correo, pass) {
  try {
    const user = await findUserByCorreo(correo);
    if (user) {
      // Verifica que se proporcionó una nueva contraseña
      if (pass) {
        // Actualiza la contraseña del usuario
        const hashedpass = await bcrypt.hash(pass, 10);
        const updateSuccess = await updateUserPass(correo, hashedpass);

        if (updateSuccess) {
          return { success: true, message: 'Contraseña cambiada con éxito' };
        } else {
          return { success: false, message: 'Error al cambiar la contraseña' };
        }
      } else {
        return { success: false, message: 'La nueva contraseña no fue proporcionada' };
      }
    } else {
      return { success: false, message: 'El correo electrónico no se encuentra registrado' };
    }
  } catch (error) {
    console.error('Error al manejar la solicitud de recuperación de contraseña:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}
module.exports = {
  findUserByUser,
  findUserByCorreo,
  updateUserPass,
  registerAdmin,
  handleForgotPasswordRequest,
};