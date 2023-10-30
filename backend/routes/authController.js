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

    if (!user) {
      return { success: false, message: 'El correo electrónico no se encuentra registrado' };
    }

    if (!pass) {
      return { success: false, message: 'La nueva contraseña no fue proporcionada' };
    }

    const hashedpass = await bcrypt.hash(pass, 10);
    const updateSuccess = await updateUserPass(correo, hashedpass);

    if (updateSuccess) {
      return { success: true, message: 'Contraseña cambiada con éxito' };
    } else {
      return { success: false, message: 'Error al cambiar la contraseña' };
    }
  } catch (error) {
    console.error('Error al manejar la solicitud de recuperación de contraseña:', error);
    return { success: false, message: 'Error interno del servidor - Detalles: ' + error.message };
  }
}



module.exports = {
  findUserByUser,
  findUserByCorreo,
  updateUserPass,
  registerAdmin,
  handleForgotPasswordRequest,
};