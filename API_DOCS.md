# 📚 Documentação da API - Gerenciador de Tarefas

## 🔐 Autenticação

Todas as rotas da API requerem autenticação via sessão. O usuário deve estar logado para acessar os endpoints.

**Status de erro de autenticação:**
```json
{
  "success": false,
  "message": "Acesso negado. Faça login para continuar."
}
```

## 📋 Endpoints Disponíveis

### 1. **GET /api/tarefas** - Listar todas as tarefas

**Descrição:** Retorna todas as tarefas do usuário logado.

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "1234567890",
      "descricao": "Estudar Node.js",
      "status": "pendente",
      "dataPublicacao": "2024-01-15T10:30:00.000Z",
      "dataConclusao": null,
      "tempoLevado": null,
      "usuarioId": "1"
    }
  ],
  "total": 1
}
```

### 2. **GET /api/tarefas/:id** - Buscar tarefa específica

**Descrição:** Retorna uma tarefa específica pelo ID.

**Parâmetros:**
- `id` (string): ID da tarefa

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": {
    "_id": "1234567890",
    "descricao": "Estudar Node.js",
    "status": "pendente",
    "dataPublicacao": "2024-01-15T10:30:00.000Z",
    "dataConclusao": null,
    "tempoLevado": null,
    "usuarioId": "1"
  }
}
```

**Resposta de erro (404):**
```json
{
  "success": false,
  "message": "Tarefa não encontrada"
}
```

### 3. **POST /api/tarefas** - Criar nova tarefa

**Descrição:** Cria uma nova tarefa para o usuário logado.

**Body (JSON):**
```json
{
  "descricao": "Nova tarefa a ser realizada"
}
```

**Validações:**
- `descricao` é obrigatória
- `descricao` deve ter pelo menos 3 caracteres

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Tarefa criada com sucesso",
  "data": {
    "_id": "1234567890",
    "descricao": "Nova tarefa a ser realizada",
    "status": "pendente",
    "dataPublicacao": "2024-01-15T10:30:00.000Z",
    "dataConclusao": null,
    "tempoLevado": null,
    "usuarioId": "1"
  }
}
```

### 4. **PUT /api/tarefas/:id** - Atualizar tarefa

**Descrição:** Atualiza uma tarefa existente.

**Parâmetros:**
- `id` (string): ID da tarefa

**Body (JSON):**
```json
{
  "descricao": "Descrição atualizada",
  "status": "concluida"
}
```

**Campos opcionais:**
- `descricao` (string): Nova descrição da tarefa
- `status` (string): "pendente" ou "concluida"

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Tarefa atualizada com sucesso",
  "data": {
    "_id": "1234567890",
    "descricao": "Descrição atualizada",
    "status": "concluida",
    "dataPublicacao": "2024-01-15T10:30:00.000Z",
    "dataConclusao": "2024-01-15T15:45:00.000Z",
    "tempoLevado": "5 hora(s)",
    "usuarioId": "1"
  }
}
```

### 5. **DELETE /api/tarefas/:id** - Excluir tarefa

**Descrição:** Remove uma tarefa permanentemente.

**Parâmetros:**
- `id` (string): ID da tarefa

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Tarefa excluída com sucesso",
  "data": {
    "_id": "1234567890",
    "descricao": "Tarefa removida",
    "status": "pendente",
    "dataPublicacao": "2024-01-15T10:30:00.000Z",
    "dataConclusao": null,
    "tempoLevado": null,
    "usuarioId": "1"
  }
}
```

### 6. **POST /api/tarefas/:id/concluir** - Concluir tarefa

**Descrição:** Marca uma tarefa como concluída e calcula o tempo levado.

**Parâmetros:**
- `id` (string): ID da tarefa

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Tarefa concluída com sucesso",
  "data": {
    "_id": "1234567890",
    "descricao": "Estudar Node.js",
    "status": "concluida",
    "dataPublicacao": "2024-01-15T10:30:00.000Z",
    "dataConclusao": "2024-01-15T15:45:00.000Z",
    "tempoLevado": "5 hora(s)",
    "usuarioId": "1"
  }
}
```

### 7. **GET /api/usuario** - Dados do usuário

**Descrição:** Retorna os dados do usuário logado (sem a senha).

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": {
    "_id": "1",
    "nomeCompleto": "João Silva",
    "email": "joao@email.com",
    "dataNascimento": "1990-01-01T00:00:00.000Z"
  }
}
```

### 8. **GET /api/estatisticas** - Estatísticas das tarefas

**Descrição:** Retorna estatísticas das tarefas do usuário.

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": {
    "totalTarefas": 10,
    "tarefasPendentes": 3,
    "tarefasConcluidas": 7,
    "percentualConclusao": 70,
    "tempoMedioConclusao": "2 hora(s)"
  }
}
```

## 🔧 Códigos de Status HTTP

- **200** - OK (sucesso)
- **201** - Created (criado com sucesso)
- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (não autenticado)
- **404** - Not Found (não encontrado)
- **500** - Internal Server Error (erro interno)

## 📝 Exemplos de Uso

### JavaScript (Fetch API)

```javascript
// Listar tarefas
fetch('/api/tarefas')
  .then(response => response.json())
  .then(data => console.log(data));

// Criar nova tarefa
fetch('/api/tarefas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    descricao: 'Nova tarefa via API'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Concluir tarefa
fetch('/api/tarefas/1234567890/concluir', {
  method: 'POST'
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL

```bash
# Listar tarefas
curl -X GET http://localhost:3000/api/tarefas

# Criar tarefa
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Nova tarefa via cURL"}'

# Atualizar tarefa
curl -X PUT http://localhost:3000/api/tarefas/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"status": "concluida"}'

# Excluir tarefa
curl -X DELETE http://localhost:3000/api/tarefas/1234567890
```

## 🚀 Testando a API

1. **Faça login** na aplicação web
2. **Use o console do navegador** para testar as rotas
3. **Use Postman** ou similar para testes mais avançados
4. **Use cURL** no terminal

## 📊 Estrutura de Resposta Padrão

### Sucesso
```json
{
  "success": true,
  "message": "Mensagem de sucesso",
  "data": { /* dados retornados */ }
}
```

### Erro
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Detalhes do erro (apenas em desenvolvimento)"
}
```

---

**Base URL:** `http://localhost:3000/api`
**Autenticação:** Sessão (cookies)
**Formato:** JSON
