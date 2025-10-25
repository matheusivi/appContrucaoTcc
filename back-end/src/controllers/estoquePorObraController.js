const {
   listarEstoquePorObra,
   obterEstoquePorObraEProduto
  } = require('../services/estoquePorObraService');
  
  async function listarEstoquePorObraController(req, res) {
    try {
      const { obra_id } = req.params;
      const estoque = await listarEstoquePorObra(parseInt(obra_id));
      res.status(200).json(estoque);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async function obterEstoquePorObraEProdutoController(req, res) {
    try {
      const { obra_id, produto_id } = req.params;
      const estoque = await obterEstoquePorObraEProduto(parseInt(obra_id), parseInt(produto_id));
      res.status(200).json(estoque);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  module.exports = {
    listarEstoquePorObraController,
    obterEstoquePorObraEProdutoController,
  };