const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /tarefas - Listar todas as tarefas do usuário
router.get('/', taskController.listarTarefas);

// POST /tarefas - Criar nova tarefa
router.post('/', taskController.criarTarefa);

// POST /tarefas/:id/concluir - Marcar tarefa como concluída
router.post('/:id/concluir', taskController.concluirTarefa);

// POST /tarefas/:id/reabrir - Reabrir tarefa concluída
router.post('/:id/reabrir', taskController.reabrirTarefa);

// POST /tarefas/:id/excluir - Excluir tarefa
router.post('/:id/excluir', taskController.excluirTarefa);

// POST /tarefas/:id/atualizar - Atualizar descrição da tarefa
router.post('/:id/atualizar', taskController.atualizarTarefa);

// GET /tarefas/:id/editar - Mostrar formulário de edição
router.get('/:id/editar', taskController.mostrarEdicaoTarefa);

module.exports = router;
