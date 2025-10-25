const express = require('express');
const {
  criarProduto,
  listarProdutosController,
  listarProdutosPorId,
  atualizarProdutosControllers,
  deletarProdutos,
} = require('../controllers/produtoController');
const validateProduto = require('../middlewares/validateProduto');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/produtos', authMiddleware ,validateProduto, criarProduto);
router.get('/produtos', authMiddleware ,listarProdutosController);
router.get('/produtos/:id', authMiddleware ,listarProdutosPorId);
router.put('/produtos/:id', authMiddleware ,validateProduto, atualizarProdutosControllers);
router.delete('/produtos/:id', authMiddleware ,deletarProdutos);

module.exports = router;