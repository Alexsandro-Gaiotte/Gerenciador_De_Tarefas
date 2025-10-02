# Gerenciador de Tarefas

Sistema completo de gerenciamento de tarefas desenvolvido com Node.js, Express.js, EJS e MongoDB.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Registro e login com validação de dados
- **Gerenciamento de Tarefas**: Criar, editar, concluir e excluir tarefas
- **Interface Responsiva**: Design moderno com glassmorphism
- **Banco de Dados**: Integração com MongoDB para persistência de dados
- **Segurança**: Senhas criptografadas com bcrypt
- **Sessões**: Controle de sessão de usuário

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Banco de Dados**: Arrays em memória (simulação)
- **Sessões**: express-session
- **Estilização**: CSS3 com glassmorphism
- **API**: RESTful endpoints

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório** (ou baixe os arquivos):
```bash
git clone <url-do-repositorio>
cd gerenciador-tarefas
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Execute a aplicação**:
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

4. **Acesse a aplicação**:
Abra seu navegador e acesse: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
gerenciador-tarefas/
├── controllers/          # Lógica de negócio
│   ├── authController.js
│   └── taskController.js
├── routes/              # Definição das rotas
│   ├── auth.js
│   ├── tasks.js
│   └── api.js
├── views/               # Templates EJS
│   ├── login.ejs
│   ├── registro.ejs
│   └── tarefas.ejs
├── public/              # Arquivos estáticos
│   ├── css/
│   │   ├── style.css
│   │   └── background-config.css
│   └── js/
│       └── api-examples.js
├── app.js               # Arquivo principal
├── package.json
├── README.md
└── API_DOCS.md
```

## 🎯 Como Usar

### 1. Registro de Usuário
- Acesse `/registro`
- Preencha os dados: Nome completo, email, data de nascimento e senha
- Clique em "Registrar"

### 2. Login
- Acesse `/login`
- Digite email e senha
- Clique em "Entrar"

### 3. Gerenciar Tarefas
- Após o login, você será redirecionado para `/tarefas`
- **Criar tarefa**: Digite a descrição e clique em "Adicionar Tarefa"
- **Concluir tarefa**: Clique em "✓ Concluir"
- **Editar tarefa**: Clique em "✏️ Editar"
- **Excluir tarefa**: Clique em "🗑️ Excluir"

## 🔒 Segurança

- Senhas são criptografadas usando bcryptjs
- Validação de dados no frontend e backend
- Sessões seguras com express-session
- Validação de email e dados de entrada

## 🎨 Design

O projeto utiliza um design moderno com:
- **Glassmorphism**: Efeito de vidro fosco em todos os cards
- **Gradientes**: Background com gradiente colorido personalizável
- **Responsividade**: Interface adaptável para mobile e desktop
- **Animações**: Transições suaves e efeitos hover
- **Backgrounds Personalizáveis**: 10 opções de background diferentes
- **API RESTful**: Endpoints completos para integração

## 🔌 API RESTful

O projeto inclui uma API completa com os seguintes endpoints:

### Endpoints Principais
- `GET /api/tarefas` - Listar todas as tarefas
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/:id` - Atualizar tarefa
- `DELETE /api/tarefas/:id` - Excluir tarefa
- `POST /api/tarefas/:id/concluir` - Concluir tarefa
- `GET /api/usuario` - Dados do usuário
- `GET /api/estatisticas` - Estatísticas das tarefas

### Documentação da API
Consulte o arquivo `API_DOCS.md` para documentação completa da API.

### Exemplos de Uso
```javascript
// Criar nova tarefa via API
fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao: 'Nova tarefa' })
});

// Listar tarefas
fetch('/api/tarefas').then(r => r.json());
```

## 🎨 Personalização de Background

O projeto inclui 10 opções de background personalizáveis:

1. **Gradiente Animado** - Gradiente colorido em movimento
2. **Padrão Geométrico** - Formas geométricas abstratas
3. **Imagem Personalizada** - Sua própria imagem de fundo
4. **Partículas Animadas** - Efeito de partículas em movimento
5. **Ondas** - Padrão de ondas SVG
6. **Grid Animado** - Grade em movimento
7. **Formas Abstratas** - Círculos e elipses animados
8. **Código Binário** - Padrão de código binário
9. **Hexágonos** - Padrão hexagonal
10. **Círculos Concêntricos** - Círculos em movimento

**Como personalizar:**
1. Abra `public/css/background-config.css`
2. Descomente a opção desejada
3. Salve e recarregue a página

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente
2. Use um banco MongoDB em nuvem (MongoDB Atlas)
3. Configure um servidor web (Nginx)
4. Use PM2 para gerenciar processos Node.js

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Alex** - Desenvolvedor Full Stack

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
