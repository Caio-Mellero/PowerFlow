require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Define a porta, padrão 3000 se não estiver no .env

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota de teste simples
app.get('/', (req, res) => {
  res.send('Servidor PowerFlow rodando!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor PowerFlow rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});