const { body, validationResult } = require('express-validator');

const validateProdutos = [
  (req, res, next) => {
    next();
  },
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('unidade_medida')
    .notEmpty()
    .withMessage('Unidade de medida é obrigatória'),
  body('quantidade_atual')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantidade atual deve ser maior ou igual a 0'),
  body('descricao')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

module.exports = validateProdutos;
