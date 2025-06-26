const db = require('../models'); // Importa o objeto 'db' do Sequelize
const Task = db.Task;           // Acessa o modelo Task

// 1. Criar uma nova tarefa
exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, category } = req.body;
  const userId = req.user.id; // O ID do usuário logado vem do middleware de autenticação

  try {
    const newTask = await Task.create({
      userId,
      title,
      description,
      dueDate,
      priority,
      category,
      status: 'pending', // Nova tarefa sempre começa como pendente
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao criar tarefa.');
  }
};

// 2. Listar todas as tarefas de um usuário
exports.getTasks = async (req, res) => {
  const userId = req.user.id; // ID do usuário logado

  try {
    const tasks = await Task.findAll({
      where: { userId },
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']] // Ordena por data de vencimento e depois por criação
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao buscar tarefas.');
  }
};

// 3. Obter uma única tarefa por ID
exports.getTaskById = async (req, res) => {
  const taskId = req.params.id; // Pega o ID da tarefa da URL
  const userId = req.user.id;   // ID do usuário logado

  try {
    const task = await Task.findOne({
      where: { id: taskId, userId } // Garante que a tarefa pertence ao usuário logado
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao buscar tarefa.');
  }
};

// 4. Atualizar uma tarefa existente
exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, dueDate, priority, status, category } = req.body;

  try {
    const [updatedRows] = await Task.update(
      { title, description, dueDate, priority, status, category },
      {
        where: { id: taskId, userId }, // Garante que a tarefa pertence ao usuário logado
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário.' });
    }
    // O Sequelize update não retorna o objeto atualizado diretamente,
    // então buscamos a tarefa novamente para retornar os dados mais recentes.
    const updatedTask = await Task.findOne({ where: { id: taskId } });
    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao atualizar tarefa.');
  }
};

// 5. Excluir uma tarefa
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const deletedRows = await Task.destroy({
      where: { id: taskId, userId }, // Garante que a tarefa pertence ao usuário logado
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário.' });
    }
    res.status(204).send(); // Status 204 indica sucesso sem conteúdo de resposta
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao excluir tarefa.');
  }
};