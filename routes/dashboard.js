const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /dashboard - Página principal do dashboard
router.get('/', dashboardController.mostrarDashboard);

module.exports = router;
