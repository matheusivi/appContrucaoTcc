const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

function authMiddleware(req, res, next) {
  console.log('🚪 Requisição recebida em:', req.originalUrl);
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou inválido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // ✅ Aceita diferentes formatos vindos do token
    const usuario_id = decoded.usuario_id || decoded.usuarioId || decoded.id;

    if (!usuario_id || isNaN(usuario_id)) {
      return res
        .status(401)
        .json({ error: 'Token inválido: ID do usuário ausente ou inválido' });
    }

    // ✅ Padronização global (snake_case)
    req.user = { usuario_id: Number(usuario_id) };

    console.log('🔍 Token decodificado:', decoded);
    console.log('👤 req.user:', req.user);

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error.message);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authMiddleware;
