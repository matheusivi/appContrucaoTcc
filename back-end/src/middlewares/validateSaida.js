const { body, validationResult } = require('express-validator');

const validateSaida = [
  body('produto_id').isInt().withMessage('Produto ID deve ser um número inteiro'),
  body('quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro maior que 0'),
  body('obra_id').optional().isInt().withMessage('Obra ID deve ser um número inteiro'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateSaida;