const express = require('express');
const { createSaida } = require('../controllers/saidaController');
const validateSaida = require('../middlewares/validateSaida');
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/saida', authMiddleware, validateSaida, createSaida);

module.exports = router;