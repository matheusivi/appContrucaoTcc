const {
  criarFase,
  atualizarFase,
  listarFasesPorObra,
} = require('../services/faseService');

async function createFase(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const { obra_id, nome, data_inicio, data_fim_prevista, percentual_concluido, peso } = req.body;

    if (!obra_id) return res.status(400).json({ error: 'O campo obra_id é obrigatório.' });
    if (!nome || nome.trim() === '') return res.status(400).json({ error: 'Nome da fase é obrigatório.' });

    const faseData = {
      ...req.body,
      percentual_concluido: Number(percentual_concluido) || 0,
      peso: Number(peso) || 1,
    };

    const fase = await criarFase(faseData, usuarioId);
    res.status(201).json(fase);
  } catch (error) {
    console.error('Erro no createFase:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar fase' });
  }
}

async function updateFase(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) return res.status(401).json({ error: 'Usuário não autenticado.' });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'O ID da fase é obrigatório.' });

    const faseData = {
      ...req.body,
      percentual_concluido:
        req.body.percentual_concluido !== undefined
          ? Number(req.body.percentual_concluido)
          : undefined,
      peso:
        req.body.peso !== undefined
          ? Number(req.body.peso)
          : undefined,
    };

    const fase = await atualizarFase(parseInt(id), faseData, usuarioId);
    res.status(200).json(fase);
  } catch (error) {
    console.error('Erro no updateFase:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar fase' });
  }
}

async function getFasesPorObra(req, res) {
  try {
    const { obraId } = req.params;
    if (!obraId) return res.status(400).json({ error: 'O ID da obra é obrigatório.' });

    const fases = await listarFasesPorObra(parseInt(obraId));
    res.status(200).json(fases);
  } catch (error) {
    console.error('Erro no getFasesPorObra:', error);
    res.status(400).json({ error: error.message || 'Erro ao buscar fases' });
  }
}

/**
 * updateProgressoObra
 * Aceita body { fases: [ { id?, nome, data_inicio?, data_fim_prevista?, data_fim_real?, percentual_concluido?, peso? }, ... ] }
 * - Se id existe -> atualiza via atualizarFase
 * - Se id ausente -> cria via criarFase (associa obraId)
 * Retorna array com as fases processadas (criadas/atualizadas)
 */
async function updateProgressoObra(req, res) {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const { obraId } = req.params;
    const { fases } = req.body;

    if (!obraId) return res.status(400).json({ error: 'O ID da obra é obrigatório.' });
    if (!fases || !Array.isArray(fases)) return res.status(400).json({ error: 'O campo "fases" deve ser um array.' });

    const resultados = [];

    for (const fase of fases) {
      // normalizar campos
      const fasePayload = {
        nome: fase.nome || '',
        data_inicio: fase.data_inicio || null,
        data_fim_prevista: fase.data_fim_prevista || fase.data_fim_previsto || null,
        data_fim_real: fase.data_fim_real || null,
        percentual_concluido: fase.percentual_concluido !== undefined ? Number(fase.percentual_concluido) : 0,
        peso: fase.peso !== undefined ? Number(fase.peso) : 1,
      };

      if (fase.id) {
        // update existente
        try {
          const atualizada = await atualizarFase(parseInt(fase.id), fasePayload, usuarioId);
          resultados.push(atualizada);
        } catch (err) {
          // registrar erro mas continuar processando as demais
          console.warn(`Falha ao atualizar fase id=${fase.id}:`, err.message || err);
        }
      } else {
        // criar nova fase vinculada à obraId
        try {
          const criarPayload = { ...fasePayload, obra_id: Number(obraId) };
          const criada = await criarFase(criarPayload, usuarioId);
          resultados.push(criada);
        } catch (err) {
          console.warn('Falha ao criar fase (sem id):', err.message || err);
        }
      }
    }

    res.status(200).json({
      message: `Processadas ${resultados.length} fases para obra ${obraId}`,
      fasesAtualizadas: resultados,
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso da obra:', error);
    res.status(400).json({ error: error.message || 'Erro ao processar fases' });
  }
}

module.exports = {
  createFase,
  updateFase,
  getFasesPorObra,
  updateProgressoObra,
};
