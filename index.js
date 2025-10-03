const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing do body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'gerenciador-tarefas-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Simulação do banco de dados em memória (para funcionar sem MongoDB)
let usuarios = [
    {
        _id: '1',
        nomeCompleto: 'Usuário Admin',
        email: 'admin@teste.com',
        dataNascimento: new Date('1990-01-01'),
        senha: '123456' // Em produção, isso seria hash
    }
];

let tarefas = [];

// Middleware para disponibilizar dados globais
app.use((req, res, next) => {
    // Buscar usuário atual nos arrays em memória
    if (req.session.userId) {
        res.locals.currentUser = usuarios.find(u => u._id === req.session.userId);
    } else {
        res.locals.currentUser = null;
    }
    next();
});

// Disponibilizar arrays globalmente para os controllers
app.locals.usuarios = usuarios;
app.locals.tarefas = tarefas;

// Importar rotas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const apiRoutes = require('./routes/api');
const dashboardRoutes = require('./routes/dashboard');
const pagesRoutes = require('./routes/pages');

// Usar rotas
app.use('/', authRoutes);
app.use('/', requireAuth, pagesRoutes);
app.use('/tarefas', requireAuth, taskRoutes);
app.use('/dashboard', requireAuth, dashboardRoutes);
app.use('/api', apiRoutes);

// Rota raiz - redireciona para login
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
