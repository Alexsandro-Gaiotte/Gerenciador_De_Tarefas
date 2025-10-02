// Controller para gerenciar autenticação de usuários (versão sem MongoDB)

// Função para gerar ID único
const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};

// Função para validar email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Função para validar data de nascimento
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
};

// POST /registro
const registrarUsuario = (req, res) => {
    const { nomeCompleto, email, dataNascimento, senha } = req.body;
    
    // Validações básicas
    if (!nomeCompleto || !email || !dataNascimento || !senha) {
        return res.render('registro', { 
            error: 'Todos os campos são obrigatórios!',
            formData: req.body
        });
    }

    if (!isValidEmail(email)) {
        return res.render('registro', { 
            error: 'Email inválido!',
            formData: req.body
        });
    }

    if (!isValidDate(dataNascimento)) {
        return res.render('registro', { 
            error: 'Data de nascimento inválida!',
            formData: req.body
        });
    }

    if (senha.length < 6) {
        return res.render('registro', { 
            error: 'A senha deve ter pelo menos 6 caracteres!',
            formData: req.body
        });
    }

    // Verificar se email já existe
    const usuarioExistente = req.app.locals.usuarios.find(u => u.email === email.toLowerCase().trim());
    if (usuarioExistente) {
        return res.render('registro', { 
            error: 'Email já cadastrado!',
            formData: req.body
        });
    }

    // Criar novo usuário
    const novoUsuario = {
        _id: generateId().toString(),
        nomeCompleto: nomeCompleto.trim(),
        email: email.toLowerCase().trim(),
        dataNascimento: new Date(dataNascimento),
        senha // Em produção, isso seria hash
    };

    req.app.locals.usuarios.push(novoUsuario);
    
    res.render('login', { 
        success: 'Usuário registrado com sucesso! Faça login para continuar.',
        formData: { email }
    });
};

// POST /login
const fazerLogin = (req, res) => {
    const { email, senha } = req.body;
    
    // Validações
    if (!email || !senha) {
        return res.render('login', { 
            error: 'Email e senha são obrigatórios!',
            formData: req.body
        });
    }

    // Buscar usuário nos arrays em memória
    const usuario = req.app.locals.usuarios.find(u => 
        u.email === email.toLowerCase().trim() && u.senha === senha
    );

    if (!usuario) {
        return res.render('login', { 
            error: 'Email ou senha incorretos!',
            formData: req.body
        });
    }

    // Criar sessão
    req.session.userId = usuario._id;
    req.session.userName = usuario.nomeCompleto;
    
    res.redirect('/home');
};

// GET /login
const mostrarLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/home');
    }
    res.render('login', { 
        error: req.query.error,
        success: req.query.success,
        formData: {}
    });
};

// GET /registro
const mostrarRegistro = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/tarefas');
    }
    res.render('registro', { 
        error: req.query.error,
        formData: {}
    });
};

// POST /logout
const fazerLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        }
        res.redirect('/login?success=' + encodeURIComponent('Logout realizado com sucesso!'));
    });
};

module.exports = {
    registrarUsuario,
    fazerLogin,
    mostrarLogin,
    mostrarRegistro,
    fazerLogout
};
