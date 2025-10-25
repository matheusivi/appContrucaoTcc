const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarTransferencia(data, usuarioId) {
  const { produto_id, quantidade, origem_obra_id, destino_obra_id } = data;

  if (!produto_id || !quantidade || !origem_obra_id || !destino_obra_id) {
    throw new Error('produto_id, quantidade, origem_obra_id e destino_obra_id são obrigatórios');
  }

  if (origem_obra_id === destino_obra_id) {
    throw new Error('Obra de origem e destino não podem ser iguais');
  }

  const produto = await prisma.produtos.findUnique({ where: { id: produto_id } });
  if (!produto) throw new Error('Produto não encontrado');

  const obraOrigem = await prisma.obras.findUnique({ where: { id: origem_obra_id } });
  const obraDestino = await prisma.obras.findUnique({ where: { id: destino_obra_id } });
  if (!obraOrigem || !obraDestino) throw new Error('Obra de origem ou destino não encontrada');

  const estoqueOrigem = await prisma.estoque_por_obra.findFirst({
    where: { produto_id, obra_id: origem_obra_id },
  });
  if (!estoqueOrigem || estoqueOrigem.quantidade < quantidade) {
    throw new Error('Estoque insuficiente na obra de origem');
  }

  const novaTransferencia = await prisma.transferencias.create({
    data: {
      produto_id,
      quantidade,
      origem_obra_id,
      destino_obra_id,
      usuario_id: usuarioId,
      data_transferencia: new Date(),
    },
  });

  await prisma.estoque_por_obra.update({
    where: { id: estoqueOrigem.id },
    data: { quantidade: estoqueOrigem.quantidade - quantidade },
  });

  const estoqueDestino = await prisma.estoque_por_obra.findFirst({
    where: { produto_id, obra_id: destino_obra_id },
  });
  if (estoqueDestino) {
    await prisma.estoque_por_obra.update({
      where: { id: estoqueDestino.id },
      data: { quantidade: estoqueDestino.quantidade + quantidade },
    });
  } else {
    await prisma.estoque_por_obra.create({
      data: {
        produto_id,
        obra_id: destino_obra_id,
        quantidade,
      },
    });
  }

  await registrarAlteracao({
    tabela: 'estoque_por_obra',
    registroId: produto_id,
    campo: 'transferencia',
    valorAntigo: `Obra ${origem_obra_id}: ${estoqueOrigem.quantidade}`,
    valorNovo: `Obra ${destino_obra_id}: ${estoqueDestino ? estoqueDestino.quantidade + quantidade : quantidade}`,
    usuarioId,
  });

  return novaTransferencia;
}

module.exports = {
  criarTransferencia,
};