const express = require('express');
const {
  atualizarFornecedorControler,
  criarFonecedorControllers,
  excluirFornecedorController,
  listarFornecedorPorIdController,
  listarFornecedoresController
} = require('../controllers/fornecedoresController');
const validateFornecedores = require('../middlewares/validateFornecedor');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/fornecedores', authMiddleware, validateFornecedores, criarFonecedorControllers);
router.get('/fornecedores', authMiddleware, listarFornecedoresController);
router.get('/fornecedores/:id', authMiddleware, listarFornecedorPorIdController);
router.put('/fornecedores/:id', authMiddleware, validateFornecedores, atualizarFornecedorControler);
router.delete('/fornecedores/:id', authMiddleware, excluirFornecedorController);

module.exports = router;