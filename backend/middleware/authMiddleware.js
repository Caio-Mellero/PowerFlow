const jwt = require('jsonwebtoken');

// Chave secreta do JWT (a mesma que você definiu no .env)
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  // 1. Obter o token do cabeçalho da requisição
  const token = req.header('Authorization');

  // 2. Verificar se o token existe
  if (!token) {
    return res.status(401).json({ message: 'Nenhum token fornecido, autorização negada.' });
  }

  // Se o token existir, ele geralmente vem no formato "Bearer TOKEN_VALUE"
  // Precisamos extrair apenas o TOKEN_VALUE
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato do token inválido. Use: Bearer <token>' });
  }
  const actualToken = tokenParts[1];

  try {
    // 3. Verificar e decodificar o token
    const decoded = jwt.verify(actualToken, JWT_SECRET);

    // 4. Anexar os dados do usuário ao objeto de requisição
    // Isso permite que as rotas subsequentes saibam qual usuário está logado
    req.user = decoded.user; // 'decoded.user' contém { id, username, email }
    next(); // Chama a próxima função middleware ou o handler da rota

  } catch (err) {
    // 5. Lidar com token inválido
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};