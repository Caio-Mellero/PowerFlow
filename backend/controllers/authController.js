const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Importa o objeto 'db' do Sequelize
const User = db.User; // Acessa o modelo User

const JWT_SECRET = process.env.JWT_SECRET; // Sua chave secreta do .env

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Verificar se o usuário já existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Usuário com este email já existe.' });
    }
    user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ message: 'Nome de usuário já existe.' });
    }

    // 2. Hashear a senha
    const salt = await bcrypt.genSalt(10); // Gera um "sal" para o hash
    const hashedPassword = await bcrypt.hash(password, salt); // Hashea a senha

    // 3. Criar o usuário no banco de dados
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Gerar um token JWT (opcional no registro, mas bom para login automático)
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token válido por 1 hora

    res.status(201).json({ message: 'Usuário registrado com sucesso!', token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// Função para logar um usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar se o usuário existe pelo email
    let user = await User.findOne({ where: { email } });
    if (!user) { // Se o email não for encontrado no DB
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { // Se a senha não combinar
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Gerar um token JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login realizado com sucesso!', token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor.');
  }
};