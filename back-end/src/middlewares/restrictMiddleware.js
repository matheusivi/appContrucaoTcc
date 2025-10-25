const jwt = require('jsonwebtoken');

function restrictTo(niveisPermitidos) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario_id = decoded.usuario_id; // Define o ID do usuário
      req.nivel_acesso = decoded.nivel_acesso; // Define o nível de acesso

      if (!niveisPermitidos.includes(req.nivel_acesso)) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
}

module.exports = restrictTo;
