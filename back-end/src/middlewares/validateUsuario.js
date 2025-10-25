const { body, validationResult } = require('express-validator');

const validateUsuario = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('cargo').notEmpty().withMessage('Cargo é obrigatório'),
  body('nivel_acesso')
    .isIn(['alto', 'médio', 'baixo'])
    .withMessage('Nível de acesso deve ser "alto", "médio" ou "baixo"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUsuario;