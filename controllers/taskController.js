// Controller para gerenciar tarefas (versão sem MongoDB)

// Função para gerar ID único
const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};

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

// GET /tarefas
const listarTarefas = (req, res) => {
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

    res.render('tarefas', { 
        tarefas: tarefasDoUsuario,
        error: req.query.error,
        success: req.query.success
    });
};

// POST /tarefas
const criarTarefa = (req, res) => {
    const { titulo, descricao, prioridade } = req.body;
    const usuarioId = req.session.userId;
    
    // Validação
    if (!titulo || titulo.trim().length === 0) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Título da tarefa é obrigatório!'));
    }

    if (titulo.trim().length < 3) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Título deve ter pelo menos 3 caracteres!'));
    }

    // Validar prioridade
    const prioridadeValida = ['baixa', 'media', 'urgente'].includes(prioridade);
    if (!prioridadeValida) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Prioridade inválida!'));
    }

    // Criar nova tarefa
    const novaTarefa = {
        _id: generateId().toString(),
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : '',
        prioridade: prioridade || 'baixa',
        status: 'pendente',
        dataPublicacao: new Date(),
        dataConclusao: null,
        tempoLevado: null,
        usuarioId
    };

    req.app.locals.tarefas.push(novaTarefa);
    
    res.redirect('/tarefas?success=' + encodeURIComponent('Tarefa criada com sucesso!'));
};

// POST /tarefas/:id/concluir
const concluirTarefa = (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.userId;
    
    const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
    
    if (!tarefa) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa não encontrada!'));
    }

    if (tarefa.status === 'concluida') {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa já está concluída!'));
    }

    // Atualizar tarefa
    tarefa.status = 'concluida';
    tarefa.dataConclusao = new Date();
    tarefa.tempoLevado = calcularTempoDecorrido(tarefa.dataPublicacao, tarefa.dataConclusao);
    
    res.redirect('/tarefas?success=' + encodeURIComponent('Tarefa concluída com sucesso!'));
};

// POST /tarefas/:id/reabrir
const reabrirTarefa = (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.userId;
    
    const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
    
    if (!tarefa) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa não encontrada!'));
    }

    if (tarefa.status === 'pendente') {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa já está pendente!'));
    }

    // Reabrir tarefa
    tarefa.status = 'pendente';
    tarefa.dataConclusao = null;
    tarefa.tempoLevado = null;
    
    res.redirect('/tarefas?success=' + encodeURIComponent('Tarefa reaberta com sucesso!'));
};

// POST /tarefas/:id/excluir
const excluirTarefa = (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.userId;
    
    const tarefaIndex = req.app.locals.tarefas.findIndex(t => t._id === id && t.usuarioId === usuarioId);
    
    if (tarefaIndex === -1) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa não encontrada!'));
    }

    // Remover tarefa
    req.app.locals.tarefas.splice(tarefaIndex, 1);
    
    res.redirect('/tarefas?success=' + encodeURIComponent('Tarefa excluída com sucesso!'));
};

// POST /tarefas/:id/atualizar
const atualizarTarefa = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prioridade } = req.body;
    const usuarioId = req.session.userId;
    
    // Validação
    if (!titulo || titulo.trim().length === 0) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Título da tarefa é obrigatório!'));
    }

    if (titulo.trim().length < 3) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Título deve ter pelo menos 3 caracteres!'));
    }

    // Validar prioridade
    const prioridadeValida = ['baixa', 'media', 'urgente'].includes(prioridade);
    if (!prioridadeValida) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Prioridade inválida!'));
    }

    const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
    
    if (!tarefa) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa não encontrada!'));
    }

    // Atualizar tarefa
    tarefa.titulo = titulo.trim();
    tarefa.descricao = descricao ? descricao.trim() : '';
    tarefa.prioridade = prioridade || 'baixa';
    
    res.redirect('/tarefas?success=' + encodeURIComponent('Tarefa atualizada com sucesso!'));
};

// GET /tarefas/:id/editar (para mostrar formulário de edição)
const mostrarEdicaoTarefa = (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.userId;
    
    const tarefa = req.app.locals.tarefas.find(t => t._id === id && t.usuarioId === usuarioId);
    
    if (!tarefa) {
        return res.redirect('/tarefas?error=' + encodeURIComponent('Tarefa não encontrada!'));
    }

    const tarefasDoUsuario = req.app.locals.tarefas.filter(t => t.usuarioId === usuarioId);
    
    res.render('tarefas', { 
        tarefas: tarefasDoUsuario,
        tarefaEditando: tarefa,
        error: req.query.error,
        success: req.query.success
    });
};

module.exports = {
    listarTarefas,
    criarTarefa,
    concluirTarefa,
    reabrirTarefa,
    excluirTarefa,
    atualizarTarefa,
    mostrarEdicaoTarefa
};
