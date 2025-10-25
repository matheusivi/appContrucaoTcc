const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarFornecedores(data) {
  const { nome, cnpj, endereco, telefone, email, contato_principal } = data;

  const cnpjExistente = await prisma.fornecedores.findUnique({ where: { cnpj } });
  if (cnpjExistente) throw new Error('CNPJ já está em uso');

  return await prisma.fornecedores.create({
    data: {
      nome,
      cnpj,
      endereco,
      telefone,
      email,
      contato_principal,
    },
  });
}

async function listarFornecedores() {
  return await prisma.fornecedores.findMany();
}

async function buscarFornecedoresPorId(id) {
  const fornecedor = await prisma.fornecedores.findUnique({ where: { id } });
  if (!fornecedor) throw new Error('Fornecedor não encontrado');
  return fornecedor;
}

async function atualizarFornecedores(id, data) {
  const { nome, cnpj, endereco, telefone, email, contato_principal } = data;

  const fornecedor = await prisma.fornecedores.findUnique({ where: { id } });
  if (!fornecedor) throw new Error('Fornecedor não encontrado');

  if (cnpj && cnpj !== fornecedor.cnpj) {
    const cnpjExistente = await prisma.fornecedores.findUnique({ where: { cnpj } });
    if (cnpjExistente) throw new Error('CNPJ já está em uso');
  }

  return await prisma.fornecedores.update({
    where: { id },
    data: {
      nome,
      cnpj,
      endereco,
      telefone,
      email,
      contato_principal,
    },
  });
}

async function excluirFornecedores(id) {
  const fornecedor = await prisma.fornecedores.findUnique({ where: { id } });
  if (!fornecedor) throw new Error('Fornecedor não encontrado');

  const entradas = await prisma.entradas.count({ where: { fornecedor_id: id } });
  const cotacoes = await prisma.cotacoes.count({ where: { fornecedor_id: id } });
  if (entradas > 0 || cotacoes > 0) {
    throw new Error('Fornecedor está associado a entradas ou cotações e não pode ser excluído');
  }
  
  return await prisma.fornecedores.delete({
    where: { id },
  });
}

module.exports = {
  criarFornecedores,
  listarFornecedores,
  buscarFornecedoresPorId,
  atualizarFornecedores,
  excluirFornecedores,
};