require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || "minha_chave_secreta_123",
}