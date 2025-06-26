require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const db = require('./models');

const authRoutes = require('./routes/authRoutes');
// Importar as rotas de autenticação
// Essas rotas geralmente lidam com login, registro e autenticação de usuários
const taskRoutes = require('./routes/taskRoutes'); // Importar as rotas de tarefas

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes); // Usar as rotas de tarefas

app.get('/', (req, res) => {
  res.send('Servidor PowerFlow rodando!');
});

db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor PowerFlow rodando na porta ${port}`);
      console.log(`Acesse: http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
    process.exit(1);
  });