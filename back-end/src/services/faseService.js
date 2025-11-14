const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarFase(data, usuarioId) {
  let {
    obra_id,
    nome,
    data_inicio,
    data_fim_prevista,
    data_fim_real,
    percentual_concluido,
    peso,
  } = data;

  // garantir tipos básicos
  percentual_concluido = Number(percentual_concluido) || 0;
  peso = Number(peso) || 1;

  // se obra_id inválido -> erro
  if (!obra_id) throw new Error('obra_id é obrigatório para criar fase');

  // tenta achar obra (para poder usar data_inicio padrão)
  const obra = await prisma.obras.findUnique({ where: { id: Number(obra_id) } });
  if (!obra) throw new Error('Obra não encontrada');

  // se data_inicio não veio, usa data de início da obra ou hoje
  let inicioDate = data_inicio ? new Date(data_inicio) : (obra.data_inicio ? new Date(obra.data_inicio) : new Date());
  if (Number.isNaN(inicioDate.getTime())) inicioDate = new Date();

  // se data_fim_prevista não veio, usa inicio + 7 dias
  let fimPrevDate = data_fim_prevista ? new Date(data_fim_prevista) : new Date(inicioDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (Number.isNaN(fimPrevDate.getTime())) fimPrevDate = new Date(inicioDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const created = await prisma.fases.create({
    data: {
      obra_id: Number(obra_id),
      nome,
      data_inicio: inicioDate,
      data_fim_prevista: fimPrevDate,
      data_fim_real: data_fim_real ? new Date(data_fim_real) : null,
      percentual_concluido,
      peso,
    },
  });

  return created;
}

async function atualizarFase(id, data, usuarioId) {
  const {
    nome,
    data_inicio,
    data_fim_prevista,
    data_fim_real,
    percentual_concluido,
    peso,
  } = data;

  const usuario = await prisma.usuarios.findUnique({
    where: { id: usuarioId },
  });
  if (!usuario) throw new Error('Usuário não encontrado');

  const faseAntiga = await prisma.fases.findUnique({ where: { id } });
  if (!faseAntiga) throw new Error('Fase não encontrada');

  const faseAtualizada = await prisma.fases.update({
    where: { id },
    data: {
      nome: nome !== undefined ? nome : faseAntiga.nome,
      data_inicio: data_inicio ? new Date(data_inicio) : faseAntiga.data_inicio,
      data_fim_prevista: data_fim_prevista ? new Date(data_fim_prevista) : faseAntiga.data_fim_prevista,
      data_fim_real: data_fim_real ? new Date(data_fim_real) : faseAntiga.data_fim_real,
      percentual_concluido:
        percentual_concluido !== undefined
          ? Number(percentual_concluido)
          : faseAntiga.percentual_concluido,
      peso:
        peso !== undefined
          ? Number(peso)
          : faseAntiga.peso,
    },
  });

  // histórico
  try {
    if (nome && nome !== faseAntiga.nome) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'nome',
        valorAntigo: faseAntiga.nome,
        valorNovo: nome,
        usuarioId,
      });
    }
    if (data_inicio && new Date(data_inicio).toISOString() !== faseAntiga.data_inicio.toISOString()) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'data_inicio',
        valorAntigo: faseAntiga.data_inicio.toISOString(),
        valorNovo: new Date(data_inicio).toISOString(),
        usuarioId,
      });
    }
    if (data_fim_prevista && new Date(data_fim_prevista).toISOString() !== faseAntiga.data_fim_prevista.toISOString()) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'data_fim_prevista',
        valorAntigo: faseAntiga.data_fim_prevista.toISOString(),
        valorNovo: new Date(data_fim_prevista).toISOString(),
        usuarioId,
      });
    }
    if (data_fim_real && (data_fim_real ? new Date(data_fim_real).toISOString() : null) !== (faseAntiga.data_fim_real ? faseAntiga.data_fim_real.toISOString() : null)) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'data_fim_real',
        valorAntigo: faseAntiga.data_fim_real ? faseAntiga.data_fim_real.toISOString() : null,
        valorNovo: data_fim_real ? new Date(data_fim_real).toISOString() : null,
        usuarioId,
      });
    }
    if (percentual_concluido !== undefined && Number(percentual_concluido) !== faseAntiga.percentual_concluido) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'percentual_concluido',
        valorAntigo: faseAntiga.percentual_concluido,
        valorNovo: Number(percentual_concluido),
        usuarioId,
      });
    }
    if (peso !== undefined && Number(peso) !== faseAntiga.peso) {
      await registrarAlteracao({
        tabela: 'fases',
        registroId: id,
        campo: 'peso',
        valorAntigo: faseAntiga.peso,
        valorNovo: Number(peso),
        usuarioId,
      });
    }
  } catch (err) {
    console.warn('Falha ao registrar alteração (não fatal):', err.message || err);
  }

  return faseAtualizada;
}

async function listarFasesPorObra(obraId) {
  return await prisma.fases.findMany({
    where: { obra_id: Number(obraId) },
    orderBy: { id: 'asc' },
    include: {
      obras: { select: { nome: true } },
    },
  });
}

module.exports = { criarFase, atualizarFase, listarFasesPorObra };
