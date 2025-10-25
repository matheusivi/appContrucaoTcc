const { body, validationResult } = require('express-validator');

const validateOrcamentoPorObra = [
  body('obra_id').isInt().withMessage('Obra ID deve ser um número inteiro'),
  body('valor_orcado').isFloat({ min: 0 }).withMessage('Valor orçado deve ser maior ou igual a 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateOrcamentoPorObra;