const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarProdutos(data, usuarioId) {
  const { nome, descricao, unidade_medida, quantidade_atual } = data;

  const produtoExistente = await prisma.produtos.findFirst({ where: { nome } });
  if (produtoExistente) throw new Error('Produto com este nome já existe');

  const novoProduto = await prisma.produtos.create({
    data: {
      nome,
      descricao,
      unidade_medida,
      quantidade_atual: quantidade_atual !== undefined ? quantidade_atual : 0,
    },
  });

  await registrarAlteracao({
    tabela: 'produtos',
    registroId: novoProduto.id,
    campo: 'nome',
    valorAntigo: null,
    valorNovo: nome,
    usuarioId,
  });

  if (quantidade_atual !== undefined) {
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: novoProduto.id,
      campo: 'quantidade_atual',
      valorAntigo: null,
      valorNovo: quantidade_atual,
      usuarioId,
    });
  }

  return novoProduto;
}

async function listarProdutos() {
  return await prisma.produtos.findMany();
}

async function buscarProdutosPorId(id) {
  const produto = await prisma.produtos.findUnique({ where: { id } });
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

async function atualizarProdutos(id, data, usuarioId) {
  const { nome, descricao, unidade_medida, quantidade_atual } = data;

  const produto = await prisma.produtos.findUnique({ where: { id } });
  if (!produto) throw new Error('Produto não encontrado');

  if (nome && nome !== produto.nome) {
    const produtoExistente = await prisma.produtos.findFirst({ where: { nome } });
    if (produtoExistente) throw new Error('Produto com este nome já existe');
  }

  const produtoAntigo = await prisma.produtos.findUnique({ where: { id } });

  const produtoAtualizado = await prisma.produtos.update({
    where: { id },
    data: {
      nome,
      descricao,
      unidade_medida,
      quantidade_atual: quantidade_atual !== undefined ? quantidade_atual : produtoAntigo.quantidade_atual,
    },
  });

  if (nome && nome !== produtoAntigo.nome) {
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: id,
      campo: 'nome',
      valorAntigo: produtoAntigo.nome,
      valorNovo: nome,
      usuarioId,
    });
  }
  if (descricao && descricao !== produtoAntigo.descricao) {
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: id,
      campo: 'descricao',
      valorAntigo: produtoAntigo.descricao,
      valorNovo: descricao,
      usuarioId,
    });
  }
  if (unidade_medida && unidade_medida !== produtoAntigo.unidade_medida) {
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: id,
      campo: 'unidade_medida',
      valorAntigo: produtoAntigo.unidade_medida,
      valorNovo: unidade_medida,
      usuarioId,
    });
  }
  if (quantidade_atual !== undefined && quantidade_atual !== produtoAntigo.quantidade_atual) {
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: id,
      campo: 'quantidade_atual',
      valorAntigo: produtoAntigo.quantidade_atual,
      valorNovo: quantidade_atual,
      usuarioId,
    });
  }

  return produtoAtualizado;
}

async function excluirProdutos(id, usuarioId) {
  const produto = await prisma.produtos.findUnique({ where: { id } });
  if (!produto) throw new Error('Produto não encontrado');

  const entradas = await prisma.entradas.count({ where: { produto_id: id } });
  const saidas = await prisma.saidas.count({ where: { produto_id: id } });
  const cotacoes = await prisma.cotacoes.count({ where: { produto_id: id } });
  if (entradas > 0 || saidas > 0 || cotacoes > 0) {
    throw new Error('Produto está associado a entradas, saídas ou cotações e não pode ser excluído');
  }

  const produtoExcluido = await prisma.produtos.delete({
    where: { id },
  });

  await registrarAlteracao({
    tabela: 'produtos',
    registroId: id,
    campo: 'nome',
    valorAntigo: produto.nome,
    valorNovo: null,
    usuarioId,
  });

  return produtoExcluido;
}

module.exports = {
  criarProdutos,
  listarProdutos,
  buscarProdutosPorId,
  atualizarProdutos,
  excluirProdutos,
};
