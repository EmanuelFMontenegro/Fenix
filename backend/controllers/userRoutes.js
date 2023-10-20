const express = require('express');
const router = express.Router();

// Importa controladores y funciones relacionados con la gestión de usuarios
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('./userController');

// Define las rutas de gestión de usuarios
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
