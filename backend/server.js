// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o módulo Express
const express = require('express');
const app = express(); // Cria uma instância do aplicativo Express

// Define a porta do servidor, usando a variável de ambiente PORT ou 3000 como padrão
const port = process.env.PORT || 3000;

// Importa o objeto 'db' que contém os modelos e a conexão do Sequelize
// ESTA É A LINHA QUE ESTAVA FALTANDO OU FOI ALTERADA NO SEU CÓDIGO
const db = require('./models');

// Importa as rotas de autenticação que acabamos de criar
const authRoutes = require('./routes/authRoutes');

// Middleware para parsear requisições com corpo em formato JSON
// Isso permite que o Express entenda os dados enviados no corpo das requisições POST/PUT
app.use(express.json());

// Configura o Express para usar as rotas de autenticação
// Todas as rotas definidas em authRoutes.js serão acessíveis sob o prefixo /api/auth
// Por exemplo: POST /api/auth/register
app.use('/api/auth', authRoutes);

// Rota de teste simples para verificar se o servidor está online
// Quando você acessa a URL raiz (ex: http://localhost:5000/), esta mensagem é exibida
app.get('/', (req, res) => {
  res.send('Servidor PowerFlow rodando!');
});

// Sincroniza o banco de dados com os modelos definidos no Sequelize
// Se as tabelas não existirem, elas serão criadas.
// '.then()' é executado se a sincronização for bem-sucedida
db.sequelize.sync()
  .then(() => {
    // Inicia o servidor Express somente após a sincronização do banco de dados ser bem-sucedida
    app.listen(port, () => {
      console.log(`Servidor PowerFlow rodando na porta ${port}`);
      console.log(`Acesse: http://localhost:${port}`);
    });
  })
  // '.catch()' é executado se houver um erro durante a sincronização do banco de dados
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
    // Em caso de erro fatal na conexão do DB, é importante logar o erro
    // e possivelmente encerrar o processo para evitar que o servidor inicie sem DB
    process.exit(1); // Encerra o processo do Node.js com código de erro
  });