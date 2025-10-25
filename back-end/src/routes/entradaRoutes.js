const express = require('express');
const router = express.Router();
const { criarEntrada, atualizarEntrada } = require('../services/entradaService');
const validateEntrada = require('../middlewares/validateEntrada');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/entradas', authMiddleware, validateEntrada, async (req, res) => {
  console.log('Body recebido (POST):', req.body);
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId || isNaN(usuarioId)) {
      return res.status(401).json({ error: 'Usuário ID deve ser um número inteiro' });
    }

    const entrada = await criarEntrada(req.body, Number(usuarioId));
    res.status(201).json(entrada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/entradas/:id', authMiddleware, validateEntrada, async (req, res) => {
  console.log('Body recebido (POT):', req.body);
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId || isNaN(usuarioId)) {
      return res.status(401).json({ error: 'Usuário ID deve ser um número inteiro' });
    }

    const entrada = await atualizarEntrada(parseInt(req.params.id), req.body, Number(usuarioId));
    res.json(entrada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;