const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");

function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSecret);

   console.log("🔓 Token decodificado:", JSON.stringify(decoded, null, 2));

    console.log("🔑 jwtSecret usado:", jwtSecret);

    if (!decoded.usuario_id || isNaN(decoded.usuario_id)) {
      return res
        .status(401)
        .json({ error: "Token inválido: ID do usuário ausente ou inválido" });
    }
    req.user = {
      usuario_id: Number(decoded.usuario_id),
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;
