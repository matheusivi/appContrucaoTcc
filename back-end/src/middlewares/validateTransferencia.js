const { body, validationResult } = require('express-validator');

const validateTransferencias = [
  body('produto_id').isInt().withMessage('Produto ID deve ser um número inteiro'),
  body('quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('origem_obra_id').optional().isInt().withMessage('Obra de origem ID deve ser um número inteiro'),
  body('destino_obra_id').optional().isInt().withMessage('Obra de destino ID deve ser um número inteiro'),
  body().custom((value) => {
    if (value.origem_obra_id === value.destino_obra_id && value.origem_obra_id !== null) {
      throw new Error('Obra de origem e destino não podem ser iguais');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateTransferencias;