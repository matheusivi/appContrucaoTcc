const express = require('express');
const {
  listarEstoquePorObraController,
  obterEstoquePorObraEProdutoController,
} = require('../controllers/estoquePorObraController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/estoque-por-obra/obra/:obra_id', authMiddleware, listarEstoquePorObraController);
router.get('/estoque-por-obra/obra/:obra_id/produto/:produto_id', authMiddleware, obterEstoquePorObraEProdutoController);

module.exports = router;