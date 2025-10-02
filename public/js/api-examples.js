// Exemplos de uso da API do Gerenciador de Tarefas
// Este arquivo contém funções JavaScript para interagir com a API

class TaskAPI {
    constructor() {
        this.baseURL = '/api';
    }

    // Método auxiliar para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    // Listar todas as tarefas
    async listarTarefas() {
        return await this.request('/tarefas');
    }

    // Buscar tarefa específica
    async buscarTarefa(id) {
        return await this.request(`/tarefas/${id}`);
    }

    // Criar nova tarefa
    async criarTarefa(descricao, prioridade = 'baixa') {
        return await this.request('/tarefas', {
            method: 'POST',
            body: JSON.stringify({ descricao, prioridade })
        });
    }

    // Atualizar tarefa
    async atualizarTarefa(id, dados) {
        return await this.request(`/tarefas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
    }

    // Excluir tarefa
    async excluirTarefa(id) {
        return await this.request(`/tarefas/${id}`, {
            method: 'DELETE'
        });
    }

    // Concluir tarefa
    async concluirTarefa(id) {
        return await this.request(`/tarefas/${id}/concluir`, {
            method: 'POST'
        });
    }

    // Obter dados do usuário
    async obterUsuario() {
        return await this.request('/usuario');
    }

    // Obter estatísticas
    async obterEstatisticas() {
        return await this.request('/estatisticas');
    }
}

// Instância global da API
const taskAPI = new TaskAPI();

// Exemplos de uso prático
document.addEventListener('DOMContentLoaded', function() {
    // Exemplo 1: Carregar tarefas ao carregar a página
    carregarTarefas();

    // Exemplo 2: Adicionar listener para formulário de nova tarefa
    const formNovaTarefa = document.querySelector('.task-form');
    if (formNovaTarefa) {
        formNovaTarefa.addEventListener('submit', async function(e) {
            e.preventDefault();
            const input = this.querySelector('input[name="descricao"]');
            const descricao = input.value.trim();
            
            if (descricao) {
                try {
                    await taskAPI.criarTarefa(descricao);
                    input.value = '';
                    carregarTarefas(); // Recarregar lista
                    mostrarMensagem('Tarefa criada com sucesso!', 'success');
                } catch (error) {
                    mostrarMensagem('Erro ao criar tarefa: ' + error.message, 'error');
                }
            }
        });
    }

    // Exemplo 3: Adicionar listeners para botões de ação
    document.addEventListener('click', async function(e) {
        if (e.target.matches('[data-action="concluir"]')) {
            const id = e.target.dataset.id;
            try {
                await taskAPI.concluirTarefa(id);
                carregarTarefas();
                mostrarMensagem('Tarefa concluída!', 'success');
            } catch (error) {
                mostrarMensagem('Erro ao concluir tarefa: ' + error.message, 'error');
            }
        }

        if (e.target.matches('[data-action="excluir"]')) {
            const id = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                try {
                    await taskAPI.excluirTarefa(id);
                    carregarTarefas();
                    mostrarMensagem('Tarefa excluída!', 'success');
                } catch (error) {
                    mostrarMensagem('Erro ao excluir tarefa: ' + error.message, 'error');
                }
            }
        }
    });
});

// Função para carregar e exibir tarefas
async function carregarTarefas() {
    try {
        const response = await taskAPI.listarTarefas();
        console.log('Tarefas carregadas:', response.data);
        
        // Aqui você pode atualizar a interface com as tarefas
        // Por exemplo, renderizar uma lista dinâmica
        renderizarTarefas(response.data);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

// Função para renderizar tarefas na interface
function renderizarTarefas(tarefas) {
    const container = document.querySelector('.tasks-list');
    if (!container) return;

    container.innerHTML = tarefas.map(tarefa => `
        <div class="task-item ${tarefa.status === 'concluida' ? 'task-completed' : 'task-pending'}">
            <div class="task-content">
                <div class="task-header">
                    <h3 class="task-title">${tarefa.descricao}</h3>
                    <div class="task-badges">
                        <div class="task-priority">
                            <span class="priority-badge priority-${tarefa.prioridade || 'baixa'}">
                                ${tarefa.prioridade === 'urgente' ? '🔴 Urgente' : 
                                  tarefa.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}
                            </span>
                        </div>
                        <div class="task-status">
                            <span class="status-badge status-${tarefa.status}">
                                ${tarefa.status === 'concluida' ? 'Concluída' : 'Pendente'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="task-details">
                    <div class="task-date">
                        <strong>Criada em:</strong> 
                        ${new Date(tarefa.dataPublicacao).toLocaleString('pt-BR')}
                    </div>
                    ${tarefa.status === 'concluida' ? `
                        <div class="task-date">
                            <strong>Concluída em:</strong> 
                            ${new Date(tarefa.dataConclusao).toLocaleString('pt-BR')}
                        </div>
                        <div class="task-time">
                            <strong>Tempo levado:</strong> 
                            <span class="time-badge">${tarefa.tempoLevado}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                ${tarefa.status === 'pendente' ? `
                    <button class="btn btn-success btn-sm" data-action="concluir" data-id="${tarefa._id}">
                        ✓ Concluir
                    </button>
                ` : ''}
                <button class="btn btn-danger btn-sm" data-action="excluir" data-id="${tarefa._id}">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = 'info') {
    // Criar elemento de mensagem
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo === 'error' ? 'error' : 'success'}`;
    alert.textContent = mensagem;
    
    // Adicionar ao topo da página
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        // Remover após 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Função para obter estatísticas
async function mostrarEstatisticas() {
    try {
        const stats = await taskAPI.obterEstatisticas();
        console.log('Estatísticas:', stats.data);
        
        // Exibir estatísticas em um modal ou seção
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass">
                <h2>📊 Estatísticas das Tarefas</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <h3>${stats.data.totalTarefas}</h3>
                        <p>Total de Tarefas</p>
                    </div>
                    <div class="stat-item">
                        <h3>${stats.data.tarefasPendentes}</h3>
                        <p>Pendentes</p>
                    </div>
                    <div class="stat-item">
                        <h3>${stats.data.tarefasConcluidas}</h3>
                        <p>Concluídas</p>
                    </div>
                    <div class="stat-item">
                        <h3>${stats.data.percentualConclusao}%</h3>
                        <p>Taxa de Conclusão</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
    }
}

// Exemplo de uso avançado: Sincronização em tempo real
function iniciarSincronizacao() {
    // Verificar por atualizações a cada 30 segundos
    setInterval(async () => {
        try {
            const response = await taskAPI.listarTarefas();
            // Comparar com estado atual e atualizar se necessário
            console.log('Sincronização automática executada');
        } catch (error) {
            console.error('Erro na sincronização:', error);
        }
    }, 30000);
}

// Exemplo de uso: Exportar tarefas
async function exportarTarefas() {
    try {
        const response = await taskAPI.listarTarefas();
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tarefas-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao exportar tarefas:', error);
    }
}

// Disponibilizar funções globalmente
window.taskAPI = taskAPI;
window.carregarTarefas = carregarTarefas;
window.mostrarEstatisticas = mostrarEstatisticas;
window.exportarTarefas = exportarTarefas;
