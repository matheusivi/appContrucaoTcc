const { criarCotacao, atualizarCotacao, excluirCotacao, listarCotacoesPorProduto } = require("../services/cotacaoService");

async function createCotacao(req, res) {
  try {
    const cotacao = await criarCotacao(req.body);
    res.status(201).json(cotacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCotacoesPorProduto(req, res) {
  try {
    const { produto_Id } = req.params;
    const cotacoes = await listarCotacoesPorProduto(parseInt(produto_Id));
    res.status(200).json(cotacoes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateCotacao(req, res) {
  try {
    const { id } = req.params;
    const cotacao = await atualizarCotacao(parseInt(id), req.body);
    res.status(200).json(cotacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteCotacao(req, res) {
  try {
    const { id } = req.params;
    const result = await excluirCotacao(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createCotacao, getCotacoesPorProduto, updateCotacao, deleteCotacao };