const express = require('express');
const { createFase, updateFase, getFasesPorObra } = require('../controllers/faseController');
const validateFase = require('../middlewares/validateFase');
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/fases', authMiddleware, validateFase, createFase);
router.put('/fases/:id', authMiddleware, validateFase, updateFase);
router.get('/fases/obra/:obraId', authMiddleware, getFasesPorObra);

module.exports = router;