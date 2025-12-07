const express = require('express');
const { createSaida } = require('../controllers/saidaController');
const validateSaida = require('../middlewares/validateSaida');
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();


router.get('/saidas/obra/:obra_id', authMiddleware, async (req, res) => {
  const { obra_id } = req.params;
  try {
    const saidas = await prisma.saidas.findMany({
      where: { obra_id: Number(obra_id) },
    });
    res.json(saidas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/saida', authMiddleware, validateSaida, createSaida);

module.exports = router;