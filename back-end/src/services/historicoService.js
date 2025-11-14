const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registrarAlteracao({
  tabela,
  registroId,
  campo,
  valorAntigo,
  valorNovo,
  usuarioId,
  usuario_id, // aceita os dois formatos
}) {
  const userId = usuarioId || usuario_id; // prioriza o camelCase se ambos existirem

  if (!userId) {
    throw new Error('Nenhum identificador de usuário foi fornecido (usuarioId ou usuario_id).');
  }

  await prisma.historico_alteracoes.create({
    data: {
      tabela_alterada: tabela,
      registro_id: registroId,
      campo_alterado: campo,
      valor_antigo: valorAntigo ? String(valorAntigo) : null,
      valor_novo: valorNovo ? String(valorNovo) : null,
      usuarios: {
        connect: { id: userId },
      },
    },
  });
}

module.exports = { registrarAlteracao };
