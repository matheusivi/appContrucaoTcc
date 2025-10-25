const {
  atualizarObras,
  buscarObrasPorId,
  criarObras,
  excluirObras,
  listarObras,
} = require("../services/obraService");



async function criarObrasControllers(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;
    console.log("🔥 Iniciando criação de obra...");
    console.log("📦 req.body:", req.body);
    console.log("📷 req.file:", req.file);

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // Se o arquivo foi enviado, salva o caminho relativo
    let foto_url = null;
    if (req.file) {
      foto_url = `/uploads/obras/${req.file.filename}`;
      console.log("📸 Caminho da foto salvo:", foto_url);
    }

    const novaObra = {
      nome: req.body.nome,
      endereco: req.body.endereco,
      data_inicio: req.body.data_inicio,
      foto_url,
    };

    const obraCriada = await criarObras(novaObra, usuarioId);
    console.log("✅ Obra criada:", obraCriada);

    res.status(201).json(obraCriada);
  } catch (error) {
    console.error("❌ Erro ao criar obra:", error);
    res.status(500).json({ error: error.message });
  }
}

async function listarObrasController(req, res) {
  try {
    const obras = await listarObras();
    res.status(200).json(obras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarObraPorId(req, res) {
  try {
    const { id } = req.params;
    const obras = await buscarObrasPorId(parseInt(id));
    res.status(200).json(obras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function atualizarObrasController(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) throw new Error("usuarioId não encontrado em req.user");

    const { id } = req.params;
    const obra = await atualizarObras(parseInt(id), req.body, usuarioId);
    res.status(200).json(obra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function excluirObrasController(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) throw new Error("usuarioId não encontrado em req.user");

    const { id } = req.params;
    await excluirObras(parseInt(id), usuarioId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  atualizarObrasController,
  criarObrasControllers,
  excluirObrasController,
  listarObraPorId,
  listarObrasController,
};
