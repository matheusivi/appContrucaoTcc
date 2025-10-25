const { criarSaidas } = require("../services/saidaService");

async function createSaida(req, res) {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const saida = await criarSaidas(req.body, usuarioId);
    res.status(201).json(saida);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createSaida };