const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware para verificar autenticação nas rotas API
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Faça login para continuar.' 
        });
    }
};

// ===== ROTAS DE AUTENTICAÇÃO =====
// POST /api/login - Processar login
router.post('/login', authController.fazerLogin);

// POST /api/registro - Processar registro
router.post('/registro', authController.registrarUsuario);

// POST /api/logout - Fazer logout
router.post('/logout', authController.fazerLogout);

// Aplicar middleware de autenticação nas rotas protegidas
router.use(requireAuth);

// ===== ROTAS DE TAREFAS =====
// GET /api/tarefas - Listar todas as tarefas do usuário
router.get('/tarefas', (req, res) => {
    try {
        const usuarioId = req.session.userId;
        const tarefasDoUsuario = req.app.locals.tarefas.filter(t => t.usuarioId === usuarioId);
        
        // Ordenar tarefas por prioridade e status
        tarefasDoUsuario.sort((a, b) => {
            // Primeiro por status (pendentes primeiro)
            if (a.status === 'pendente' && b.status === 'concluida') return -1;
            if (a.status === 'concluida' && b.status === 'pendente') return 1;
            
            // Depois por prioridade (urgente, média, baixa)
            const prioridades = { 'urgente': 3, 'media': 2, 'baixa': 1 };
            const prioridadeA = prioridades[a.prioridade || 'baixa'];
            const prioridadeB = prioridades[b.prioridade || 'baixa'];
            
            if (prioridadeA !== prioridadeB) {
                return prioridadeB - prioridadeA; // Maior prioridade primeiro
            }
            
            // Por último, por data de criação (mais recente primeiro)
            return new Date(b.dataPublicacao) - new Date(a.dataPublicacao);
        });

        res.json({
            success: true,
            data: tarefasDoUsuario,
            total: tarefasDoUsuario.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar tarefas',
            error: error.message
        });
    }
});

// GET /api/tarefas/:id - Buscar tarefa específica
router.get('/tarefas/:id', (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.session.userId;
        
        const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
        
        if (!tarefa) {
            return res.status(404).json({
                success: false,
                message: 'Tarefa não encontrada'
            });
        }

        res.json({
            success: true,
            data: tarefa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar tarefa',
            error: error.message
        });
    }
});

// POST /api/tarefas - Criar nova tarefa
router.post('/tarefas', (req, res) => {
    try {
        const { descricao, prioridade } = req.body;
        const usuarioId = req.session.userId;
        
        // Validação
        if (!descricao || descricao.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Descrição da tarefa é obrigatória'
            });
        }

        if (descricao.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Descrição deve ter pelo menos 3 caracteres'
            });
        }

        // Validar prioridade
        const prioridadeValida = ['baixa', 'media', 'urgente'].includes(prioridade);
        if (!prioridadeValida) {
            return res.status(400).json({
                success: false,
                message: 'Prioridade inválida'
            });
        }

        // Gerar ID único
        const generateId = () => {
            return Date.now() + Math.floor(Math.random() * 1000);
        };

        // Criar nova tarefa
        const novaTarefa = {
            _id: generateId().toString(),
            descricao: descricao.trim(),
            prioridade: prioridade || 'baixa',
            status: 'pendente',
            dataPublicacao: new Date(),
            dataConclusao: null,
            tempoLevado: null,
            usuarioId
        };

        req.app.locals.tarefas.push(novaTarefa);
        
        res.status(201).json({
            success: true,
            message: 'Tarefa criada com sucesso',
            data: novaTarefa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao criar tarefa',
            error: error.message
        });
    }
});

// PUT /api/tarefas/:id - Atualizar tarefa
router.put('/tarefas/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, prioridade, status } = req.body;
        const usuarioId = req.session.userId;
        
        const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
        
        if (!tarefa) {
            return res.status(404).json({
                success: false,
                message: 'Tarefa não encontrada'
            });
        }

        // Atualizar campos fornecidos
        if (descricao !== undefined) {
            if (!descricao || descricao.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Descrição da tarefa é obrigatória'
                });
            }
            if (descricao.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Descrição deve ter pelo menos 3 caracteres'
                });
            }
            tarefa.descricao = descricao.trim();
        }

        if (prioridade !== undefined) {
            const prioridadeValida = ['baixa', 'media', 'urgente'].includes(prioridade);
            if (!prioridadeValida) {
                return res.status(400).json({
                    success: false,
                    message: 'Prioridade inválida'
                });
            }
            tarefa.prioridade = prioridade;
        }

        if (status !== undefined) {
            if (!['pendente', 'concluida'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status deve ser "pendente" ou "concluida"'
                });
            }
            
            if (status === 'concluida' && tarefa.status === 'pendente') {
                tarefa.dataConclusao = new Date();
                // Calcular tempo levado
                const diffMs = tarefa.dataConclusao - tarefa.dataPublicacao;
                const diffMinutos = Math.floor(diffMs / (1000 * 60));
                const diffHoras = Math.floor(diffMinutos / 60);
                const diffDias = Math.floor(diffHoras / 24);
                
                if (diffDias > 0) {
                    tarefa.tempoLevado = `${diffDias} dia(s)`;
                } else if (diffHoras > 0) {
                    tarefa.tempoLevado = `${diffHoras} hora(s)`;
                } else {
                    tarefa.tempoLevado = `${diffMinutos} minuto(s)`;
                }
            }
            
            tarefa.status = status;
        }

        res.json({
            success: true,
            message: 'Tarefa atualizada com sucesso',
            data: tarefa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar tarefa',
            error: error.message
        });
    }
});

// DELETE /api/tarefas/:id - Excluir tarefa
router.delete('/tarefas/:id', (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.session.userId;
        
        const tarefaIndex = req.app.locals.tarefas.findIndex(t => t._id === id && t.usuarioId === usuarioId);
        
        if (tarefaIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Tarefa não encontrada'
            });
        }

        // Remover tarefa
        const tarefaRemovida = req.app.locals.tarefas.splice(tarefaIndex, 1)[0];
        
        res.json({
            success: true,
            message: 'Tarefa excluída com sucesso',
            data: tarefaRemovida
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao excluir tarefa',
            error: error.message
        });
    }
});

// ===== ROTAS DE USUÁRIO E ESTATÍSTICAS =====
// GET /api/usuario - Obter dados do usuário atual
router.get('/usuario', (req, res) => {
    try {
        const usuarioId = req.session.userId;
        const usuario = req.app.locals.usuarios.find(u => u._id === usuarioId);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Remover senha dos dados retornados
        const { senha, ...usuarioSemSenha } = usuario;
        
        res.json({
            success: true,
            data: usuarioSemSenha
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar dados do usuário',
            error: error.message
        });
    }
});

// GET /api/estatisticas - Obter estatísticas das tarefas
router.get('/estatisticas', (req, res) => {
    try {
        const usuarioId = req.session.userId;
        const tarefasDoUsuario = req.app.locals.tarefas.filter(t => t.usuarioId === usuarioId);
        
        const totalTarefas = tarefasDoUsuario.length;
        const tarefasPendentes = tarefasDoUsuario.filter(t => t.status === 'pendente').length;
        const tarefasConcluidas = tarefasDoUsuario.filter(t => t.status === 'concluida').length;
        
        // Calcular tempo médio de conclusão
        const tarefasComTempo = tarefasDoUsuario.filter(t => t.tempoLevado);
        let tempoMedio = null;
        
        if (tarefasComTempo.length > 0) {
            const temposEmMinutos = tarefasComTempo.map(t => {
                const diffMs = new Date(t.dataConclusao) - new Date(t.dataPublicacao);
                return Math.floor(diffMs / (1000 * 60));
            });
            
            const somaTempos = temposEmMinutos.reduce((acc, tempo) => acc + tempo, 0);
            const mediaMinutos = Math.floor(somaTempos / temposEmMinutos.length);
            
            if (mediaMinutos >= 1440) { // 24 horas
                tempoMedio = `${Math.floor(mediaMinutos / 1440)} dia(s)`;
            } else if (mediaMinutos >= 60) {
                tempoMedio = `${Math.floor(mediaMinutos / 60)} hora(s)`;
            } else {
                tempoMedio = `${mediaMinutos} minuto(s)`;
            }
        }
        
        res.json({
            success: true,
            data: {
                totalTarefas,
                tarefasPendentes,
                tarefasConcluidas,
                percentualConclusao: totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0,
                tempoMedioConclusao: tempoMedio
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao calcular estatísticas',
            error: error.message
        });
    }
});

// POST /api/tarefas/:id/concluir - Concluir tarefa específica
router.post('/tarefas/:id/concluir', (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.session.userId;
        
        const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
        
        if (!tarefa) {
            return res.status(404).json({
                success: false,
                message: 'Tarefa não encontrada'
            });
        }

        if (tarefa.status === 'concluida') {
            return res.status(400).json({
                success: false,
                message: 'Tarefa já está concluída'
            });
        }

        // Marcar como concluída
        tarefa.status = 'concluida';
        tarefa.dataConclusao = new Date();
        
        // Função para calcular tempo decorrido
        const calcularTempoDecorrido = (dataInicio, dataFim) => {
            const diffMs = dataFim - dataInicio;
            const diffMinutos = Math.floor(diffMs / (1000 * 60));
            const diffHoras = Math.floor(diffMinutos / 60);
            const diffDias = Math.floor(diffHoras / 24);
            const diffSemanas = Math.floor(diffDias / 7);
            const diffMeses = Math.floor(diffDias / 30);

            if (diffMeses > 0) {
                return `${diffMeses} mês(es)`;
            } else if (diffSemanas > 0) {
                return `${diffSemanas} semana(s)`;
            } else if (diffDias > 0) {
                return `${diffDias} dia(s)`;
            } else if (diffHoras > 0) {
                return `${diffHoras} hora(s)`;
            } else if (diffMinutos > 0) {
                return `${diffMinutos} minuto(s)`;
            } else {
                return 'Menos de 1 minuto';
            }
        };

        // Calcular tempo levado
        tarefa.tempoLevado = calcularTempoDecorrido(tarefa.dataPublicacao, tarefa.dataConclusao);
        
        res.json({
            success: true,
            message: 'Tarefa concluída com sucesso',
            data: tarefa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao concluir tarefa',
            error: error.message
        });
    }
});

// POST /api/tarefas/:id/reabrir - Reabrir tarefa específica
router.post('/tarefas/:id/reabrir', (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.session.userId;
        
        const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
        
        if (!tarefa) {
            return res.status(404).json({
                success: false,
                message: 'Tarefa não encontrada'
            });
        }

        if (tarefa.status === 'pendente') {
            return res.status(400).json({
                success: false,
                message: 'Tarefa já está pendente'
            });
        }

        // Reabrir tarefa
        tarefa.status = 'pendente';
        tarefa.dataConclusao = null;
        tarefa.tempoLevado = null;
        
        res.json({
            success: true,
            message: 'Tarefa reaberta com sucesso',
            data: tarefa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao reabrir tarefa',
            error: error.message
        });
    }
});

module.exports = router;
