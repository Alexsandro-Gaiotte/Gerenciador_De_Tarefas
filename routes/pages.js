const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// GET /home - Página inicial
router.get('/home', homeController.mostrarHome);

// GET /sobre - Página sobre
router.get('/sobre', (req, res) => {
    res.render('sobre');
});

// GET /contato - Página contato
router.get('/contato', (req, res) => {
    res.render('contato');
});

// GET /api/status - Status da API
router.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        endpoints: [
            'GET /home',
            'GET /sobre', 
            'GET /tarefas',
            'GET /dashboard',
            'GET /contato',
            'GET /api/status',
            'POST /tarefas',
            'PUT /tarefas/:id',
            'DELETE /tarefas/:id',
            'POST /tarefas/:id/concluir'
        ]
    });
});

module.exports = router;
