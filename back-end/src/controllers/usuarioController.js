const {
  criarUsuarios,
  listarUsuarios,
  buscarUsuariosPorId,
  atualizarUsuarios,
  excluirUsuarios,
} = require('../services/usuarioService');

async function criarUsuariosController(req, res) {
  try {
    const usuario = await criarUsuarios(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarUsuariosController(req, res) {
  try {
    const usuarios = await listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function buscarUsuariosPorIdController(req, res) {
  try {
    const usuario = await buscarUsuariosPorId(parseInt(req.params.id));
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function atualizarUsuariosController(req, res) {
  try {
    const usuario = await atualizarUsuarios(parseInt(req.params.id), req.body);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function excluirUsuariosController(req, res) {
  try {
    await excluirUsuarios(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  criarUsuariosController,
  listarUsuariosController,
  buscarUsuariosPorIdController,
  atualizarUsuariosController,
  excluirUsuariosController,
};