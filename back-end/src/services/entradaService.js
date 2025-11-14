const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registrarAlteracao } = require('./historicoService');

async function criarEntrada(data, usuario_id) {
  const { produto_id, quantidade, obra_id, preco_unitario, fornecedor_id, nota_fiscal } = data;

  // Validação
  if (!produto_id || !quantidade || !fornecedor_id || !usuario_id || preco_unitario === undefined) {
    throw new Error('produto_id, quantidade, fornecedor_id, usuario_id e preco_unitario são obrigatórios');
  }

  if (
    isNaN(produto_id) ||
    isNaN(quantidade) ||
    isNaN(fornecedor_id) ||
    isNaN(usuario_id)
  ) {
    throw new Error('produto_id, quantidade, fornecedor_id e usuario_id devem ser números inteiros');
  }

  if (obra_id !== undefined && isNaN(obra_id)) {
    throw new Error('obra_id deve ser um número inteiro');
  }

  // Produto
  const produto = await prisma.produtos.findUnique({ where: { id: Number(produto_id) } });
  if (!produto) throw new Error('Produto não encontrado');

  // Obra (se fornecida)
  if (obra_id !== undefined) {
    const obra = await prisma.obras.findUnique({ where: { id: Number(obra_id) } });
    if (!obra) throw new Error('Obra não encontrada');
  }

  // Fornecedor
  const fornecedor = await prisma.fornecedores.findUnique({ where: { id: Number(fornecedor_id) } });
  if (!fornecedor) throw new Error('Fornecedor não encontrado');

  // Usuário
  const usuario = await prisma.usuarios.findUnique({ where: { id: Number(usuario_id) } });
  if (!usuario) throw new Error('Usuário não encontrado');

  // Cria entrada
  const novaEntrada = await prisma.entradas.create({
    data: {
      produto_id: Number(produto_id),
      quantidade: Number(quantidade),
      obra_id: obra_id !== undefined ? Number(obra_id) : null,
      data_entrada: new Date(),
      preco_unitario: Number(preco_unitario),
      fornecedor_id: Number(fornecedor_id),
      usuario_id: Number(usuario_id),
      nota_fiscal: nota_fiscal || null,
    },
  });

  // Atualiza estoque geral
  const novaQuantidadeAtual = produto.quantidade_atual + Number(quantidade);
  await prisma.produtos.update({
    where: { id: Number(produto_id) },
    data: { quantidade_atual: novaQuantidadeAtual },
  });

  // Registrar histórico
  await registrarAlteracao({
    tabela: 'produtos',
    registroId: Number(produto_id),
    campo: 'quantidade_atual',
    valorAntigo: produto.quantidade_atual,
    valorNovo: novaQuantidadeAtual,
    usuarioId: Number(usuario_id),
  });

  // Atualiza estoque da obra (se tiver obra)
  if (obra_id !== undefined) {
    const estoqueExistente = await prisma.estoque_por_obra.findFirst({
      where: { produto_id: Number(produto_id), obra_id: Number(obra_id) },
    });

    if (estoqueExistente) {
      await prisma.estoque_por_obra.update({
        where: { id: estoqueExistente.id },
        data: { quantidade: estoqueExistente.quantidade + Number(quantidade) },
      });
    } else {
      await prisma.estoque_por_obra.create({
        data: {
          produto_id: Number(produto_id),
          obra_id: Number(obra_id),
          quantidade: Number(quantidade),
        },
      });
    }
  }

  return novaEntrada;
}

async function atualizarEntrada(id, data, usuario_id) {
  const { quantidade, obra_id, preco_unitario, fornecedor_id, nota_fiscal } = data;

  // Busca entrada
  const entrada = await prisma.entradas.findUnique({ where: { id: Number(id) } });
  if (!entrada) throw new Error('Entrada não encontrada');

  // Produto
  const produto = await prisma.produtos.findUnique({ where: { id: entrada.produto_id } });
  if (!produto) throw new Error('Produto não encontrado');

  // Fornecedor
  if (fornecedor_id !== undefined) {
    if (isNaN(fornecedor_id)) {
      throw new Error('Fornecedor ID deve ser um número inteiro');
    }

    const fornecedor = await prisma.fornecedores.findUnique({ where: { id: Number(fornecedor_id) } });
    if (!fornecedor) throw new Error('Fornecedor não encontrado');
  }

  // Obra
  if (obra_id !== undefined && isNaN(obra_id)) {
    throw new Error('Obra ID deve ser um número inteiro');
  }

  if (obra_id !== undefined) {
    const obra = await prisma.obras.findUnique({ where: { id: Number(obra_id) } });
    if (!obra) throw new Error('Obra não encontrada');
  }

  // Atualização da quantidade
  let novaQuantidadeAtual = produto.quantidade_atual;

  if (quantidade !== undefined && Number(quantidade) !== entrada.quantidade) {
    const diferenca = Number(quantidade) - entrada.quantidade;
    novaQuantidadeAtual = produto.quantidade_atual + diferenca;

    // Atualiza produto
    await prisma.produtos.update({
      where: { id: entrada.produto_id },
      data: { quantidade_atual: novaQuantidadeAtual },
    });

    // Registra histórico
    await registrarAlteracao({
      tabela: 'produtos',
      registroId: entrada.produto_id,
      campo: 'quantidade_atual',
      valorAntigo: produto.quantidade_atual,
      valorNovo: novaQuantidadeAtual,
      usuarioId: Number(usuario_id),
    });

    // Estoque da obra original
    if (entrada.obra_id) {
      const estoque = await prisma.estoque_por_obra.findFirst({
        where: { produto_id: entrada.produto_id, obra_id: entrada.obra_id },
      });

      if (estoque) {
        await prisma.estoque_por_obra.update({
          where: { id: estoque.id },
          data: { quantidade: estoque.quantidade + diferenca },
        });
      }
    }
  }

  // Atualiza entrada
  const entradaAtualizada = await prisma.entradas.update({
    where: { id: Number(id) },
    data: {
      quantidade: quantidade !== undefined ? Number(quantidade) : entrada.quantidade,
      obra_id: obra_id !== undefined ? Number(obra_id) : entrada.obra_id,
      preco_unitario: preco_unitario !== undefined ? Number(preco_unitario) : entrada.preco_unitario,
      fornecedor_id: fornecedor_id !== undefined ? Number(fornecedor_id) : entrada.fornecedor_id,
      usuario_id: Number(usuario_id),
      nota_fiscal: nota_fiscal !== undefined ? nota_fiscal : entrada.nota_fiscal,
    },
  });

  // Ajuste se mudou de obra
  if (obra_id !== undefined && Number(obra_id) !== entrada.obra_id) {
    // Remove da obra antiga
    if (entrada.obra_id) {
      const estoqueAntigo = await prisma.estoque_por_obra.findFirst({
        where: { produto_id: entrada.produto_id, obra_id: entrada.obra_id },
      });

      if (estoqueAntigo) {
        await prisma.estoque_por_obra.update({
          where: { id: estoqueAntigo.id },
          data: { quantidade: estoqueAntigo.quantidade - entrada.quantidade },
        });
      }
    }

    // Adiciona na nova
    const estoqueNovo = await prisma.estoque_por_obra.findFirst({
      where: { produto_id: entrada.produto_id, obra_id: Number(obra_id) },
    });

    if (estoqueNovo) {
      await prisma.estoque_por_obra.update({
        where: { id: estoqueNovo.id },
        data: { quantidade: estoqueNovo.quantidade + entrada.quantidade },
      });
    } else {
      await prisma.estoque_por_obra.create({
        data: {
          produto_id: entrada.produto_id,
          obra_id: Number(obra_id),
          quantidade: entrada.quantidade,
        },
      });
    }
  }

  return entradaAtualizada;
}

module.exports = {
  criarEntrada,
  atualizarEntrada,
};
