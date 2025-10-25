const { criarProdutos, atualizarProdutos, buscarProdutosPorId, listarProdutos, excluirProdutos } = require('../services/produtoService');

async function criarProduto(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const produto = await criarProdutos(req.body, usuarioId);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarProdutosController(req, res) {
  try {
    const produtos = await listarProdutos();
    res.status(200).json(produtos); // 200 OK para listagem
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarProdutosPorId(req, res) {
  try {
    const { id } = req.params;
    const produto = await buscarProdutosPorId(parseInt(id));
    res.status(200).json(produto); // 200 OK para busca
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function atualizarProdutosControllers(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const { id } = req.params;
    const produto = await atualizarProdutos(parseInt(id), req.body, usuarioId);
    res.status(200).json(produto); // 200 OK para atualização
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deletarProdutos(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      throw new Error('usuarioId não encontrado em req.user');
    }
    const { id } = req.params;
    await excluirProdutos(parseInt(id), usuarioId);
    res.status(204).send(); // 204 No Content para deleção
  } catch (error) {
    res.status(400).json({ error: error.message }); // 400 para erro genérico
  }
}

module.exports = {
  criarProduto,
  listarProdutosController,
  listarProdutosPorId,
  atualizarProdutosControllers,
  deletarProdutos,
};
