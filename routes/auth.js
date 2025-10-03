const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /login - Mostrar página de login
router.get('/login', authController.mostrarLogin);

// POST /login - Processar login
router.post('/login', authController.fazerLogin);

// GET /registro - Mostrar página de registro
router.get('/registro', authController.mostrarRegistro);

// POST /registro - Processar registro
router.post('/registro', authController.registrarUsuario);

// POST /logout - Fazer logout
router.post('/logout', authController.fazerLogout);

module.exports = router;
