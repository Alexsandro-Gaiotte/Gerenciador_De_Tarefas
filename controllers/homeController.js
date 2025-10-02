// GET /home
const mostrarHome = (req, res) => {
    const usuarioId = req.session.userId;
    const tarefas = req.app.locals.tarefas;
    
    // Filtrar tarefas do usuário logado
    const tarefasDoUsuario = tarefas.filter(t => t.usuarioId === usuarioId);
    
    // Estatísticas básicas para preview
    const totalTarefas = tarefasDoUsuario.length;
    const tarefasConcluidas = tarefasDoUsuario.filter(t => t.status === 'concluida').length;
    const tarefasPendentes = tarefasDoUsuario.filter(t => t.status === 'pendente').length;
    const percentualConclusao = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;
    
    res.render('home', {
        totalTarefas,
        tarefasConcluidas,
        tarefasPendentes,
        percentualConclusao
    });
};

module.exports = {
    mostrarHome
};
