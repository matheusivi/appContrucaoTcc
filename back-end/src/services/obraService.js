const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarObras(data, usuarioId) {
  const { nome, endereco, data_inicio, data_fim_prevista, status, foto_url } = data;

  // valida se o usuário logado existe
  const usuario = await prisma.usuarios.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error("Responsável não encontrado");

 return await prisma.obras.create({
  data: {
    nome,
    endereco,
    data_inicio: new Date(data_inicio),
    data_fim_prevista: data_fim_prevista ? new Date(data_fim_prevista) : null,
    status: status || "ativa",
    foto_url,
    usuarios: {
      connect: { id: usuarioId },
    },
  },
});
}



async function listarObras() {
  return await prisma.obras.findMany({
    include: {
      usuarios: { select: { nome: true } },
    },
  });
}

async function buscarObrasPorId(id) {
  const obra = await prisma.obras.findUnique({
    where: {
      id: id,
    },
    include: {
      usuarios: {
        select: { nome: true },
      },
    },
  });
  return obra;
}


async function atualizarObras(id, data) {
  const { nome, endereco, data_inicio, foto_url } = data;

  const obra = await prisma.obras.findUnique({ where: { id } });
  if (!obra) throw new Error('Obra não encontrada');

  return await prisma.obras.update({
    where: { id },
    data: {
      nome,
      endereco,
      data_inicio: data_inicio ? new Date(data_inicio) : obra.data_inicio,
      foto_url: foto_url !== undefined ? foto_url : obra.foto_url,
    },
  });
}


async function excluirObras(id) {
  const obra = await prisma.obras.findUnique({ where: { id } });
  if (!obra) throw new Error('Obra não encontrada');

  const entradas = await prisma.entradas.count({ where: { obra_id: id } });
  const saidas = await prisma.saidas.count({ where: { obra_id: id } });
  const transferenciaOrigem = await prisma.transferencias.count({ where: { origem_obra_id: id } });
  const transferenciaDestino = await prisma.transferencias.count({ where: { destino_obra_id: id } });
  if (entradas > 0 || saidas > 0 || transferenciaDestino > 0 || transferenciaOrigem > 0) {
    throw new Error('Obra está associada a entradas, saídas ou transferências e não pode ser excluída');
  }
  return await prisma.obras.delete({
    where: { id },
  });
}

module.exports = {
  criarObras,
  listarObras,
  buscarObrasPorId,
  atualizarObras,
  excluirObras,
};