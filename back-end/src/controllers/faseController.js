const { criarFases, atualizarFases, listarFasesPorObra } = require('../services/faseService');

async function createFase(req, res) {
  try {
    console.log('req.user no createFase:', req.user);
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const fase = await criarFases(req.body, usuarioId);
    res.status(201).json(fase);
  } catch (error) {
    console.error('Erro no createFase:', error.message);
    res.status(400).json({ error: error.message });
  }
}

async function updateFase(req, res) {
  try {
    console.log('req.user no updateFase:', req.user);
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const { id } = req.params;
    const fase = await atualizarFases(parseInt(id), req.body, usuarioId);
    res.status(200).json(fase);
  } catch (error) {
    console.error('Erro no updateFase:', error.message);
    res.status(400).json({ error: error.message });
  }
}

async function getFasesPorObra(req, res) {
  try {
    console.log('req.user no getFasesPorObra:', req.user);
    const { obra_Id } = req.params;
    const fases = await listarFasesPorObra(parseInt(obra_Id));
    res.status(200).json(fases);
  } catch (error) {
    console.error('Erro no getFasesPorObra:', error.message);
    res.status(400).json({ error: error.message });
  }
}



module.exports = { createFase, updateFase, getFasesPorObra };