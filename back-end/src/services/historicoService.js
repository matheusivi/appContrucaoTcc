const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registrarAlteracao({
  tabela,
  registroId,
  campo,
  valorAntigo,
  valorNovo,
  usuarioId, // Ajustado para usuarioId, sem alias
}) {
  console.log("Usuario ID recebido:", usuarioId);
  if (!usuarioId) {
    throw new Error('usuarioId é undefined. Verifique o valor passado.');
  }

  await prisma.historico_alteracoes.create({
    data: {
      tabela_alterada: tabela,
      registro_id: registroId,
      campo_alterado: campo,
      valor_antigo: valorAntigo ? String(valorAntigo) : null,
      valor_novo: valorNovo ? String(valorNovo) : null,
      usuarios: {
        connect: { id: usuarioId },
      },
    },
  });
}

module.exports = { registrarAlteracao };
