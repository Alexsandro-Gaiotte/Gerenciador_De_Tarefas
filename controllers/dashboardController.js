// GET /dashboard
const mostrarDashboard = (req, res) => {
    const usuarioId = req.session.userId;
    const tarefas = req.app.locals.tarefas;
    
    // Filtrar tarefas do usuário logado
    const tarefasDoUsuario = tarefas.filter(t => t.usuarioId === usuarioId);
    
    // Estatísticas básicas
    const totalTarefas = tarefasDoUsuario.length;
    const tarefasConcluidas = tarefasDoUsuario.filter(t => t.status === 'concluida').length;
    const tarefasPendentes = tarefasDoUsuario.filter(t => t.status === 'pendente').length;
    const percentualConclusao = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;
    
    // Últimas 5 tarefas adicionadas
    const ultimasTarefas = tarefasDoUsuario
        .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
        .slice(0, 5);
    
    // Estatísticas por prioridade
    const statsPrioridade = {
        baixa: tarefasDoUsuario.filter(t => t.prioridade === 'baixa').length,
        media: tarefasDoUsuario.filter(t => t.prioridade === 'media').length,
        urgente: tarefasDoUsuario.filter(t => t.prioridade === 'urgente').length
    };
    
    // Tarefas por status
    const statsStatus = {
        pendentes: tarefasPendentes,
        concluidas: tarefasConcluidas
    };
    
    // Calcular tempo médio de conclusão
    const tarefasComTempo = tarefasDoUsuario.filter(t => t.tempoLevado && t.status === 'concluida');
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
    
    res.render('dashboard', {
        totalTarefas,
        tarefasConcluidas,
        tarefasPendentes,
        percentualConclusao,
        ultimasTarefas,
        statsPrioridade,
        statsStatus,
        tempoMedio
    });
};

module.exports = {
    mostrarDashboard
};
