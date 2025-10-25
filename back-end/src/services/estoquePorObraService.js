const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listarEstoquePorObra(obra_id) {
  const obra = await prisma.obras.findUnique({ where: { id: obra_id } });
  if (!obra) throw new Error('Obra não encontrada');

  return await prisma.estoque_por_obra.findMany({
    where: { obra_id },
    include: {
      produtos: { select: { id: true, nome: true, unidade_medida: true } },
    },
    orderBy: { produtos: { nome: 'asc'} }, 
  });
}

async function obterEstoquePorObraEProduto(obra_id, produto_id) {
    const obra = await prisma.obras.findUnique({ where: { id : obra_id}})
    if ( !obra ) throw new Error('Obra não encontrada.')

    const produto = await prisma.produtos.findUnique({ where: { id: produto_id}})
    if ( !produto ) throw new Error ('Produto não encotrado.')

  const estoque = await prisma.estoque_por_obra.findUnique({
    where: { obra_id_produto_id: { obra_id, produto_id } },
    include: {
      produtos: { select: { id: true, nome: true, unidade_medida: true } },
      obras: { select: { id: true, nome: true } },
    },
  });
  if (!estoque) throw new Error('Estoque não encontrado para esta obra e produto');
  return estoque;
}

module.exports = {
  listarEstoquePorObra,
  obterEstoquePorObraEProduto,
};