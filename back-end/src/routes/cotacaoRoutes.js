const express = require('express');
const { createCotacao, getCotacoesPorProduto, updateCotacao, deleteCotacao } = require('../controllers/cotacaoController');
const validateCotacao = require('../middlewares/validateCotacao');

const router = express.Router();

router.post('/cotacoes', validateCotacao, createCotacao);
router.get('/cotacoes/produto/:produto_Id', getCotacoesPorProduto);
router.put('/cotacoes/:id', validateCotacao, updateCotacao); 
router.delete('/cotacoes/:id', deleteCotacao); 

module.exports = router;