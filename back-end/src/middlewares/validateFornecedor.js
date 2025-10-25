const { body, validationResult } = require('express-validator');

const validateFornecedores = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('cnpj')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato 12.345.678/0001-99'),
  body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
  body('telefone').optional().isString().withMessage('Telefone deve ser uma string'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('contato_principal').optional().isString().withMessage('Contato principal deve ser uma string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateFornecedores;