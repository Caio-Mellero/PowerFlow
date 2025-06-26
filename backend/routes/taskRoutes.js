const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); // Importa o controlador de tarefas
const authMiddleware = require('../middleware/authMiddleware');   // Importa o middleware de autenticação

// Todas as rotas abaixo usarão o middleware 'authMiddleware' para proteger o acesso.
// Isso significa que o usuário precisa estar logado (com um JWT válido) para acessá-las.

// Rota para criar uma nova tarefa (POST /api/tasks)
router.post('/', authMiddleware, taskController.createTask);

// Rota para listar todas as tarefas do usuário logado (GET /api/tasks)
router.get('/', authMiddleware, taskController.getTasks);

// Rota para obter uma tarefa específica por ID (GET /api/tasks/:id)
router.get('/:id', authMiddleware, taskController.getTaskById);

// Rota para atualizar uma tarefa existente por ID (PUT /api/tasks/:id)
router.put('/:id', authMiddleware, taskController.updateTask);

// Rota para excluir uma tarefa por ID (DELETE /api/tasks/:id)
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;