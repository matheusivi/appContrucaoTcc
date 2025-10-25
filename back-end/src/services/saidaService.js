const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarSaidas(data, usuarioId) {
  const { produto_id, quantidade, obra_id } = data;

  if (!produto_id || !quantidade || !obra_id) {
    throw new Error('produto_id, quantidade e obra_id são obrigatórios');
  }

  const produto = await prisma.produtos.findUnique({ where: { id: produto_id } });
  if (!produto) throw new Error('Produto não encontrado');

  const obra = await prisma.obras.findUnique({ where: { id: obra_id } });
  if (!obra) throw new Error('Obra não encontrada');

  if (produto.quantidade_atual < quantidade) {
    throw new Error('Estoque insuficiente no estoque geral da construtora');
  }

  const estoqueObra = await prisma.estoque_por_obra.findFirst({
    where: { produto_id, obra_id },
  });
  if (!estoqueObra || estoqueObra.quantidade < quantidade) {
    throw new Error('Estoque insuficiente na obra especificada');
  }

  const novaSaida = await prisma.saidas.create({
    data: {
      produto_id,
      quantidade,
      obra_id,
      usuario_id: usuarioId,
      data_saida: new Date(),
    },
  });

  const novaQuantidadeAtual = produto.quantidade_atual - quantidade;
  await prisma.produtos.update({
    where: { id: produto_id },
    data: { quantidade_atual: novaQuantidadeAtual },
  });

  await registrarAlteracao({
    tabela: 'produtos',
    registroId: produto_id,
    campo: 'quantidade_atual',
    valorAntigo: produto.quantidade_atual,
    valorNovo: novaQuantidadeAtual,
    usuarioId,
  });

  await prisma.estoque_por_obra.update({
    where: { id: estoqueObra.id },
    data: { quantidade: estoqueObra.quantidade - quantidade },
  });

  return novaSaida;
}

module.exports = { criarSaidas };