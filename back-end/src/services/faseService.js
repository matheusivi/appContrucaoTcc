const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarFase(data, usuarioId) {
  const { obra_id, nome, data_inicio, data_fim_prevista, data_fim_real, percentual_concluido, peso } = data;

  const obra = await prisma.obras.findUnique({ where: { id: obra_id } });
  if (!obra) throw new Error('Obra não encontrada');

  const usuario = await prisma.usuarios.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error('Usuário não encontrado');

  return await prisma.fases.create({
    data: {
      obra_id,
      nome,
      data_inicio: new Date(data_inicio),
      data_fim_prevista: new Date(data_fim_prevista),
      data_fim_real: data_fim_real ? new Date(data_fim_real) : null,
      percentual_concluido: percentual_concluido || 0,
      peso: peso || 1,
    },
  });
}

async function atualizarFase(id, data, usuarioId) {
  const { nome, data_inicio, data_fim_prevista, data_fim_real, percentual_concluido, peso } = data;

  const usuario = await prisma.usuarios.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error('Usuário não encontrado');

  const faseAntiga = await prisma.fases.findUnique({ where: { id } });
  if (!faseAntiga) throw new Error('Fase não encontrada');

  const faseAtualizada = await prisma.fases.update({
    where: { id },
    data: {
      nome,
      data_inicio: data_inicio ? new Date(data_inicio) : faseAntiga.data_inicio,
      data_fim_prevista: data_fim_prevista ? new Date(data_fim_prevista) : faseAntiga.data_fim_prevista,
      data_fim_real: data_fim_real ? new Date(data_fim_real) : faseAntiga.data_fim_real,
      percentual_concluido: percentual_concluido !== undefined ? percentual_concluido : faseAntiga.percentual_concluido,
      peso: peso !== undefined ? peso : faseAntiga.peso,
    },
  });

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
  if (percentual_concluido !== undefined && percentual_concluido !== faseAntiga.percentual_concluido) {
    await registrarAlteracao({
      tabela: 'fases',
      registroId: id,
      campo: 'percentual_concluido',
      valorAntigo: faseAntiga.percentual_concluido,
      valorNovo: percentual_concluido,
      usuarioId,
    });
  }
  if (peso !== undefined && peso !== faseAntiga.peso) {
    await registrarAlteracao({
      tabela: 'fases',
      registroId: id,
      campo: 'peso',
      valorAntigo: faseAntiga.peso,
      valorNovo: peso,
      usuarioId,
    });
  }

  return faseAtualizada;
}

module.exports = { criarFase, atualizarFase };