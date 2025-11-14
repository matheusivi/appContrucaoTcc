const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

/* ============================================================
   🧩 CRIAR PRODUTO
============================================================ */
async function criarProdutos(data, usuarioId) {
  try {
    const { nome, descricao, unidade_medida, quantidade_atual } = data;

    if (!usuarioId) {
      throw new Error('Usuário não informado para criação de produto.');
    }

    const produtoExistente = await prisma.produtos.findFirst({
      where: { nome },
    });
    if (produtoExistente) throw new Error('Produto com este nome já existe.');

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        descricao,
        unidade_medida,
        quantidade_atual: quantidade_atual ?? 0,
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
  } catch (error) {
    throw error;
  }
}

/* ============================================================
   📋 LISTAR PRODUTOS
============================================================ */
async function listarProdutos() {
  try {
    const produtos = await prisma.produtos.findMany();

    return produtos;
  } catch (error) {
    throw error;
  }
}

/* ============================================================
   🔍 BUSCAR PRODUTO POR ID
============================================================ */
async function buscarProdutosPorId(id) {
  try {
    const produto = await prisma.produtos.findUnique({ where: { id } });
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }

    return produto;
  } catch (error) {
    throw error;
  }
}

/* ============================================================
   ✏️ ATUALIZAR PRODUTO
============================================================ */
async function atualizarProdutos(id, data, usuarioId) {
  try {
    const { nome, descricao, unidade_medida, quantidade_atual } = data;

    const produtoAntigo = await prisma.produtos.findUnique({ where: { id } });
    if (!produtoAntigo) throw new Error('Produto não encontrado.');

    if (nome && nome !== produtoAntigo.nome) {
      const produtoExistente = await prisma.produtos.findFirst({
        where: { nome },
      });
      if (produtoExistente) throw new Error('Produto com este nome já existe.');
    }

    const produtoAtualizado = await prisma.produtos.update({
      where: { id },
      data: {
        nome,
        descricao,
        unidade_medida,
        quantidade_atual:
          quantidade_atual !== undefined
            ? quantidade_atual
            : produtoAntigo.quantidade_atual,
      },
    });

    // Registrar histórico de alterações
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
    if (
      quantidade_atual !== undefined &&
      quantidade_atual !== produtoAntigo.quantidade_atual
    ) {
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
  } catch (error) {
    throw error;
  }
}

/* ============================================================
   🗑️ EXCLUIR PRODUTO
============================================================ */
async function excluirProdutos(id, usuarioId) {
  try {
    const produto = await prisma.produtos.findUnique({ where: { id } });
    if (!produto) throw new Error('Produto não encontrado.');

    const entradas = await prisma.entradas.count({ where: { produto_id: id } });
    const saidas = await prisma.saidas.count({ where: { produto_id: id } });
    const cotacoes = await prisma.cotacoes.count({ where: { produto_id: id } });

    if (entradas > 0 || saidas > 0 || cotacoes > 0) {
      throw new Error(
        'Produto está associado a entradas, saídas ou cotações e não pode ser excluído.',
      );
    }

    const produtoExcluido = await prisma.produtos.delete({ where: { id } });

    await registrarAlteracao({
      tabela: 'produtos',
      registroId: id,
      campo: 'nome',
      valorAntigo: produto.nome,
      valorNovo: null,
      usuarioId,
    });

    return produtoExcluido;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  criarProdutos,
  listarProdutos,
  buscarProdutosPorId,
  atualizarProdutos,
  excluirProdutos,
};
