// Endpoint para crear un nuevo empleado (POST)
router.post('/crear_empleado', async (req, res) => {
    try {
      const { nombre, apellido, registro_rostro_id } = req.body; // Datos del empleado desde la detección facial
  
      if (!nombre || !apellido || !registro_rostro_id) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }
  
      // Validar que el registro_rostro_id sea un número entero y que exista en la tabla rostros
      if (!Number.isInteger(registro_rostro_id)) {
        return res.status(400).json({ error: 'El registro_rostro_id debe ser un número entero' });
      }
  
      const connection = await db();
      const [rostro] = await connection.execute(
        'SELECT * FROM rostros WHERE registro_rostro_id = ?',
        [registro_rostro_id]
      );
  
      if (rostro.length === 0) {
        return res.status(404).json({ error: 'El registro_rostro_id no existe en la tabla rostros' });
      }
  
      const nuevoEmpleado = {
        usuario_id: 12, // Usar el usuario ID 12
        horario_laboral: '08:00-17:00',
        activo: 'A', // Activo (A) como valor predeterminado
        registro_rostro_id,
      };
  
      // Insertar el nuevo empleado en la base de datos
      const [result] = await connection.execute(
        'INSERT INTO empleados (usuario_id, horario_laboral, activo, registro_rostro_id) VALUES (?, ?, ?, ?)',
        [nuevoEmpleado.usuario_id, nuevoEmpleado.horario_laboral, nuevoEmpleado.activo, nuevoEmpleado.registro_rostro_id]
      );
  
      if (result.affectedRows !== 1) {
        return res.status(500).json({ error: 'Error al crear el empleado' });
      }
  
      res.status(201).json({ message: 'Empleado creado con éxito', empleado: nuevoEmpleado });
    } catch (err) {
      console.error('Error al crear el empleado:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Otros endpoints para obtener, actualizar y eliminar empleados podrían agregarse de manera similar.
  // Endpoint para obtener todos los empleados (GET)
  router.get('/empleados', async (req, res) => {
    try {
      const connection = await db();
      const [rows] = await connection.execute(`
        SELECT e.*, u.nombre AS usuario_nombre, r.nombre AS rostro_nombre, r.apellido AS rostro_apellido,
        e.registro_rostro_id AS empleado_rostro_id, r.registro_rostro_id AS rostro_id
        FROM empleados AS e
        LEFT JOIN usuarios AS u ON e.usuario_id = u.usuario_id
        LEFT JOIN rostros AS r ON e.registro_rostro_id = r.rostro_id
      `);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron empleados' });
      }
  
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error al obtener los empleados:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Endpoint para actualizar un empleado (PUT)
  router.put('/actualizar_empleado/:id', async (req, res) => {
    try {
      const { id } = req.params; // Id del empleado desde la ruta
      const { usuario_id, horario_laboral, activo, registro_rostro_id } = req.body; // Nuevos datos del empleado desde el cuerpo de la solicitud
  
      if (!usuario_id || !horario_laboral || !activo || !registro_rostro_id) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }
  
      // Validar que el id sea un número entero y que exista en la tabla empleados
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'El id debe ser un número entero' });
      }
  
      const connection = await db();
      const [empleado] = await connection.execute(
        'SELECT * FROM empleados WHERE empleado_id = ?',
        [id]
      );
  
      if (empleado.length === 0) {
        return res.status(404).json({ error: 'El empleado con ese id no existe' });
      }
  
      // Validar que el usuario_id sea un número entero y que exista en la tabla usuarios
      if (!Number.isInteger(usuario_id)) {
        return res.status(400).json({ error: 'El usuario_id debe ser un número entero' });
      }
  
      const [usuario] = await connection.execute(
        'SELECT * FROM usuarios WHERE usuario_id = ?',
        [usuario_id]
      );
  
      if (usuario.length === 0) {
        return res.status(404).json({ error: 'El usuario con ese usuario_id no existe' });
      }
  
      // Validar que el registro_rostro_id sea un número entero y que exista en la tabla rostros
      if (!Number.isInteger(registro_rostro_id)) {
        return res.status(400).json({ error: 'El registro_rostro_id debe ser un número entero' });
      }
  
      const [rostro] = await connection.execute(
        'SELECT * FROM rostros WHERE registro_rostro_id = ?',
        [registro_rostro_id]
      );
  
      if (rostro.length === 0) {
        return res.status(404).json({ error: 'El registro_rostro_id no existe en la tabla rostros' });
      }
  
      // Actualizar el empleado en la base de datos
      const [result] = await connection.execute(
        'UPDATE empleados SET usuario_id = ?, horario_laboral = ?, activo = ?, registro_rostro_id = ? WHERE empleado_id = ?',
        [usuario_id, horario_laboral, activo, registro_rostro_id, id]
      );
  
      if (result.affectedRows !== 1) {
        return res.status(500).json({ error: 'Error al actualizar el empleado' });
      }
  
      res.status(200).json({ message: 'Empleado actualizado con éxito', empleado: { usuario_id, horario_laboral, activo, registro_rostro_id } });
    } catch (err) {
      console.error('Error al actualizar el empleado:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Endpoint para eliminar un empleado (DELETE)
  router.delete('/eliminar_empleado/:id', async (req, res) => {
    try {
      const { id } = req.params; // Id del empleado desde la ruta
  
      // Validar que el id sea un número entero y que exista en la tabla empleados
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'El id debe ser un número entero' });
      }
  
      const connection = await db();
      const [empleado] = await connection.execute(
        'SELECT * FROM empleados WHERE empleado_id = ?',
        [id]
      );
  
      if (empleado.length === 0) {
        return res.status(404).json({ error: 'El empleado con ese id no existe' });
      }
  
      // Eliminar el empleado de la base de datos
      const [result] = await connection.execute(
        'DELETE FROM empleados WHERE empleado_id = ?',
        [id]
      );
  
      if (result.affectedRows !== 1) {
        return res.status(500).json({ error: 'Error al eliminar el empleado' });
      }
  
      res.status(200).json({ message: 'Empleado eliminado con éxito' });
    } catch (err) {
      console.error('Error al eliminar el empleado:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  module.exports = router;