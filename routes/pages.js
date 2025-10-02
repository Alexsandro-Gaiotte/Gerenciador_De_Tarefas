const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const taskController = require('../controllers/taskController');

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// ===== ROTAS DE AUTENTICAÇÃO =====
// GET /login - Mostrar página de login
router.get('/login', authController.mostrarLogin);

// POST /login - Processar login
router.post('/login', authController.fazerLogin);

// GET /registro - Mostrar página de registro
router.get('/registro', authController.mostrarRegistro);

// POST /registro - Processar registro
router.post('/registro', authController.registrarUsuario);

// ===== ROTAS DE PÁGINAS PRINCIPAIS =====
// GET /home - Página inicial
router.get('/home', requireAuth, homeController.mostrarHome);

// GET /sobre - Página sobre
router.get('/sobre', (req, res) => {
    res.render('sobre');
});

// GET /contato - Página contato
router.get('/contato', (req, res) => {
    res.render('contato');
});

// ===== ROTAS DE DASHBOARD =====
// GET /dashboard - Página principal do dashboard
router.get('/dashboard', requireAuth, dashboardController.mostrarDashboard);

// ===== ROTAS DE TAREFAS =====
// GET /tarefas - Listar todas as tarefas do usuário
router.get('/tarefas', requireAuth, taskController.listarTarefas);

// POST /tarefas - Criar nova tarefa
router.post('/tarefas', requireAuth, taskController.criarTarefa);

// POST /tarefas/:id/concluir - Marcar tarefa como concluída
router.post('/tarefas/:id/concluir', requireAuth, taskController.concluirTarefa);

// POST /tarefas/:id/reabrir - Reabrir tarefa concluída
router.post('/tarefas/:id/reabrir', requireAuth, taskController.reabrirTarefa);

// POST /tarefas/:id/excluir - Excluir tarefa
router.post('/tarefas/:id/excluir', requireAuth, taskController.excluirTarefa);

// POST /tarefas/:id/atualizar - Atualizar descrição da tarefa
router.post('/tarefas/:id/atualizar', requireAuth, taskController.atualizarTarefa);

// GET /tarefas/:id/editar - Mostrar formulário de edição
router.get('/tarefas/:id/editar', requireAuth, taskController.mostrarEdicaoTarefa);

// ===== ROTAS DE STATUS =====
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
