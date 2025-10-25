const express = require('express');
const {
 createOrcamento,
 getOrcamentoReport,
 updateOrcamento
} = require('../controllers/orcamentoController');
const validateOrcamento = require('../middlewares/validateOrcamento');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/orcamento', authMiddleware, validateOrcamento, createOrcamento);
router.put('/orcamento/:id', authMiddleware, validateOrcamento, updateOrcamento);
router.get('/orcamento/obra/:obraId', authMiddleware, getOrcamentoReport);

module.exports = router;