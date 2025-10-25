const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria um orçamento para uma obra
async function criarOrcamentosPorObra(data) {
  const { obra_id, valor_orcado } = data;

  // Verificar existência de obra_id
  const obra = await prisma.obras.findUnique({ where: { id: obra_id } });
  if (!obra) throw new Error('Obra não encontrada');

  // Verificar se já existe orçamento para a obra
  const orcamentoExistente = await prisma.orcamento_por_obra.findUnique({ where: { obra_id } });
  if (orcamentoExistente) throw new Error('Já existe um orçamento para esta obra');

  return await prisma.orcamento_por_obra.create({
    data: {
      obra_id,
      valor_orcado,
    },
  });
}

// Atualiza o valor orçado
async function atualizarOrcamentosPorObra(id, data) {
  const { valor_orcado } = data;

  // Verificar se o orçamento existe
  const orcamento = await prisma.orcamento_por_obra.findUnique({ where: { id } });
  if (!orcamento) throw new Error('Orçamento não encontrado');

  return await prisma.orcamento_por_obra.update({
    where: { id },
    data: { valor_orcado },
  });
}

// Calcula o valor orçado versus o custo real baseado nas entradas
async function getOrcamentoVsReal(obra_id) {
  // Verificar se a obra existe
  const obra = await prisma.obras.findUnique({ where: { id: obra_id } });
  if (!obra) throw new Error('Obra não encontrada');

  const orcamento = await prisma.orcamento_por_obra.findUnique({
    where: { obra_id },
  });

  const entradas = await prisma.entradas.findMany({
    where: { obra_id },
    select: { quantidade: true, preco_unitario: true },
  });

  // Converter Decimal para Number para cálculos precisos
  const custoReal = entradas.reduce((sum, entrada) => {
    return sum + entrada.quantidade * Number(entrada.preco_unitario);
  }, 0);

  return {
    obra_id,
    valor_orcado: orcamento ? Number(orcamento.valor_orcado) : 0,
    custo_real: custoReal,
    saldo: (orcamento ? Number(orcamento.valor_orcado) : 0) - custoReal,
  };
}

module.exports = { criarOrcamentosPorObra, atualizarOrcamentosPorObra, getOrcamentoVsReal };
