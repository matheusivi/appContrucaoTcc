const { criarOrcamentosPorObra, atualizarOrcamentosPorObra, getOrcamentoVsReal } = require('../services/orcamentoService');

async function createOrcamento(req, res) {
  try {
    const orcamento = await criarOrcamentosPorObra(req.body);
    res.status(201).json(orcamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateOrcamento(req, res) {
  try {
    const { id } = req.params;
    const orcamento = await atualizarOrcamentosPorObra(parseInt(id), req.body);
    res.status(200).json(orcamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getOrcamentoReport(req, res) {
  try {
    const { obra_Id } = req.params;
    const report = await getOrcamentoVsReal(parseInt(obra_Id));
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createOrcamento, updateOrcamento, getOrcamentoReport };