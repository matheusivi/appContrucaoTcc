const { body, validationResult } = require('express-validator');

const validateFases = [
  body('obra_id').isInt().withMessage('Obra ID deve ser um número inteiro'),
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('data_inicio').isISO8601().withMessage('Data de início deve ser uma data válida (YYYY-MM-DD)'),
  body('data_fim_prevista')
    .isISO8601()
    .withMessage('Data de fim prevista deve ser uma data válida (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.data_inicio)) {
        throw new Error('Data de fim prevista deve ser após a data de início');
      }
      return true;
    }),
  body('data_fim_real')
    .optional({ nullable: true})
    .isISO8601()
    .withMessage('Data de fim real deve ser uma data válida (YYYY-MM-DD)'),
  body('percentual_concluido')
    .isInt({ min: 0, max: 100 })
    .withMessage('Percentual concluído deve estar entre 0 e 100'),
  body('peso').isInt({ min: 1 }).withMessage('Peso deve ser maior que 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateFases;