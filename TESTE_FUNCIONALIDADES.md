# 🧪 Teste de Funcionalidades

## Como testar o projeto:

### 1. **Iniciar o servidor**
```bash
node app.js
```

### 2. **Acessar a aplicação**
- Abra: `http://localhost:3000`
- Deve redirecionar para `/login`

### 3. **Testar Login**
- **Email:** `admin@teste.com`
- **Senha:** `123456`
- Deve redirecionar para `/tarefas`

### 4. **Testar Criação de Tarefas**
- Digite uma descrição no campo "Nova Tarefa"
- Clique em "Adicionar Tarefa"
- A tarefa deve aparecer na lista

### 5. **Testar Conclusão de Tarefas**
- Clique no botão "✓ Concluir" de uma tarefa pendente
- A tarefa deve mudar para "Concluída"
- Deve mostrar data de conclusão e tempo levado

### 6. **Testar Edição de Tarefas**
- Clique no botão "✏️ Editar" de uma tarefa
- O formulário deve mudar para "Editar Tarefa"
- Modifique a descrição e clique "Atualizar Tarefa"
- A tarefa deve ser atualizada

### 7. **Testar Exclusão de Tarefas**
- Clique no botão "🗑️ Excluir" de uma tarefa
- Confirme a exclusão no popup
- A tarefa deve ser removida da lista

### 8. **Testar API (opcional)**
- Abra o console do navegador (F12)
- Execute: `fetch('/api/tarefas').then(r => r.json())`
- Deve retornar as tarefas em JSON

## ✅ Funcionalidades que devem funcionar:

- [x] Login com usuário admin
- [x] Criação de novas tarefas
- [x] Listagem de tarefas
- [x] Conclusão de tarefas
- [x] Edição de tarefas
- [x] Exclusão de tarefas
- [x] Cálculo de tempo levado
- [x] Interface responsiva
- [x] Efeitos glassmorphism
- [x] API RESTful

## 🐛 Problemas conhecidos:

- Nenhum problema identificado
- Todas as funcionalidades estão funcionando

## 📝 Notas:

- O projeto usa arrays em memória (dados são perdidos ao reiniciar)
- Para persistência, seria necessário implementar MongoDB
- A API está totalmente funcional
- O design é responsivo e moderno
