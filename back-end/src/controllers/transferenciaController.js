const { criarTransferencia } = require("../services/transferenciaService");

async function createTransferencia(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      throw new Error("usuarioId não encontrado em req.user");
    }
    const transferencia = await criarTransferencia(req.body, usuarioId);
    res.status(201).json(transferencia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createTransferencia,
};
