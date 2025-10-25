const express = require('express');
const {
  criarUsuariosController,
  listarUsuariosController,
  buscarUsuariosPorIdController,
  atualizarUsuariosController,
  excluirUsuariosController,
} = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictMiddleware');
const validateUsuario = require('../middlewares/validateUsuario');

const router = express.Router();

router.post('/usuario', authMiddleware, restrictTo(['alto']), validateUsuario, criarUsuariosController);
router.get('/usuario', authMiddleware, listarUsuariosController);
router.get('/usuario/:id', authMiddleware, buscarUsuariosPorIdController);
router.put('/usuario/:id', authMiddleware, restrictTo(['alto']), validateUsuario, atualizarUsuariosController);
router.delete('/usuario/:id', authMiddleware, restrictTo(['alto']), excluirUsuariosController);

module.exports = router;