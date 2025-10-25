const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarCotacao(data, usuarioId) {
  const { produto_id, fornecedor_id, preco } = data;

  if (!produto_id || !fornecedor_id || preco === undefined) {
    throw new Error('produto_id, fornecedor_id e preco são obrigatórios');
  }

  const produto = await prisma.produtos.findUnique({ where: { id: produto_id } });
  if (!produto) throw new Error('Produto não encontrado');

  const fornecedor = await prisma.fornecedores.findUnique({ where: { id: fornecedor_id } });
  if (!fornecedor) throw new Error('Fornecedor não encontrado');

  const novaCotacao = await prisma.cotacoes.create({
    data: {
      produto_id,
      fornecedor_id,
      preco,
      data_cotacao: new Date(),
    },
  });

  return novaCotacao;
}

async function atualizarCotacao(id, data, usuarioId) {
  const { preco } = data;

  const cotacao = await prisma.cotacoes.findUnique({ where: { id } });
  if (!cotacao) throw new Error('Cotação não encontrada');

  const cotacaoAtualizada = await prisma.cotacoes.update({
    where: { id },
    data: {
      preco: preco !== undefined ? preco : cotacao.preco,
    },
  });

  return cotacaoAtualizada;
}

async function excluirCotacao(id, usuarioId) {
  const cotacao = await prisma.cotacoes.findUnique({ where: { id } });
  if (!cotacao) throw new Error('Cotação não encontrada');

  await prisma.cotacoes.delete({ where: { id } });

  return { message: 'Cotação excluída com sucesso' };
}

async function listarCotacoesPorProduto(produtoId) {
  const cotacoes = await prisma.cotacoes.findMany({
    where: { produto_id: produtoId },
  });
  return cotacoes;
}

module.exports = {
  criarCotacao,
  atualizarCotacao,
  excluirCotacao,
  listarCotacoesPorProduto,
};