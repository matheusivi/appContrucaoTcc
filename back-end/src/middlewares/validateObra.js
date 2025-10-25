const { body, validationResult } = require('express-validator');

const validateObras = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('data_inicio').isISO8601().withMessage('Data de início deve ser uma data válida (YYYY-MM-DD)'),
  body('data_fim_prevista')
    .optional()
    .isISO8601()
    .withMessage('Data de fim prevista deve ser uma data válida (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.data_inicio)) {
        throw new Error('Data de fim prevista deve ser após a data de início');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['planejamento', 'ativa', 'concluída'])
    .withMessage('Status deve ser "planejamento", "ativa" ou "concluída"'),
  body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
  body('foto_url').optional({ nullable: true }).isString().withMessage('caminho do arquivo no servidor'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateObras;