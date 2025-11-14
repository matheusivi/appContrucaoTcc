const { criarEntrada, atualizarEntrada } = require('../services/entradaService');

async function createEntrada(req, res) {
  try {
    if (!req.body) throw new Error('Corpo da requisição não fornecido');
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const entrada = await criarEntrada(req.body, usuarioId);
    res.status(201).json(entrada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateEntrada(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const { id } = req.params;
    const entrada = await atualizarEntrada(parseInt(id), req.body, usuarioId);
    res.status(200).json(entrada);
  } catch (error) {;
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createEntrada,
  updateEntrada,
};