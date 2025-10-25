const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function criarUsuarios(data) {
  const { nome, email, senha, cargo, nivel_acesso } = data;

  const emailExistente = await prisma.usuarios.findUnique({ where: { email } });
  if (emailExistente) throw new Error('Email já está em uso');

  const senhaHash = await bcrypt.hash(senha, 10);

  return await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      cargo,
      nivel_acesso,
    },
  });
}

async function listarUsuarios() {
  return await prisma.usuarios.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      cargo: true,
      nivel_acesso: true,
      data_criacao: true,
      ultimo_login: true,
    },
  });
}

async function buscarUsuariosPorId(id) {
  const usuario = await prisma.usuarios.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cargo: true,
      nivel_acesso: true,
      data_criacao: true,
      ultimo_login: true,
    },
  });
  if (!usuario) throw new Error('Usuário não encontrado');
  return usuario;
}

async function atualizarUsuarios(id, data) {
  const { nome, email, senha, cargo, nivel_acesso } = data;

  const usuario = await prisma.usuarios.findUnique({ where: { id } });
  if (!usuario) throw new Error('Usuário não encontrado');

  if (email && email !== usuario.email) {
    const emailExistente = await prisma.usuarios.findUnique({ where: { email } });
    if (emailExistente) throw new Error('Email já está em uso');
  }

  const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;

  return await prisma.usuarios.update({
    where: { id },
    data: {
      nome,
      email,
      senha: senhaHash,
      cargo,
      nivel_acesso,
    },
  });
}

async function excluirUsuarios(id) {
  const usuario = await prisma.usuarios.findUnique({ where: { id } });
  if (!usuario) throw new Error('Usuário não encontrado');
  return await prisma.usuarios.delete({ where: { id } });
}

module.exports = {
  criarUsuarios,
  listarUsuarios,
  buscarUsuariosPorId,
  atualizarUsuarios,
  excluirUsuarios,
};