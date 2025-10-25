const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");
const prisma = new PrismaClient();

// Registra um novo usuário
async function registrar(data) {
  const { nome, email, senha, cargo, nivel_acesso } = data;

  // Verificar se o email já existe
  const emailExistente = await prisma.usuarios.findUnique({ where: { email } });
  if (emailExistente) throw new Error("Email já está em uso");

  // Hashear a senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Criar o usuário
  const usuario = await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      cargo,
      nivel_acesso, // Mantido por compatibilidade com o modelo Prisma
    },
  });

  // Gerar token JWT
  const token = jwt.sign({ usuario_id: usuario.id }, jwtSecret, {
    expiresIn: "10h",
  });

  return {
    usuario: { id: usuario.id, nome, email, cargo },
    token,
  };
}

// Realiza login
async function login(data) {
  const { email, senha } = data;

  // Buscar usuário por email
  const usuario = await prisma.usuarios.findUnique({ where: { email } });
  if (!usuario) throw new Error("Credenciais inválidas");

  // Verificar senha do usuário
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw new Error("Credenciais inválidas");

  // Atualizar o último login
  await prisma.usuarios.update({
    where: { id: usuario.id },
    data: { ultimo_login: new Date() },
  });

  // Gerar token JWT
  const token = jwt.sign({ usuario_id: usuario.id }, jwtSecret, {
    expiresIn: "10h",
  });

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    },
    token,
  };
}

module.exports = { registrar, login };
