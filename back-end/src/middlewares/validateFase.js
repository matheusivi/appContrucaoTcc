const { body, validationResult } = require('express-validator');

const validateFases = [
  // 🔢 obra_id precisa ser inteiro e positivo
  body('obra_id')
    .isInt({ min: 1 })
    .withMessage('O campo obra_id deve ser um número inteiro positivo'),

  // 🏗️ nome é obrigatório
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('O nome da fase é obrigatório'),

  // 📅 data_inicio obrigatória e formato ISO
  body('data_inicio')
    .isISO8601()
    .withMessage('Data de início deve estar no formato válido (YYYY-MM-DD)'),

  // 📅 data_fim_prevista obrigatória, formato válido e lógica de comparação
  body('data_fim_prevista')
    .isISO8601()
    .withMessage('Data de fim prevista deve estar no formato válido (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const inicio = new Date(req.body.data_inicio);
      const fimPrevista = new Date(value);
      if (fimPrevista <= inicio) {
        throw new Error('A data de fim prevista deve ser posterior à data de início');
      }
      return true;
    }),

  // 📅 data_fim_real opcional, mas válida se existir
  body('data_fim_real')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Data de fim real deve estar no formato válido (YYYY-MM-DD)'),

  // 📊 percentual_concluido entre 0 e 100 — opcional
  body('percentual_concluido')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('O percentual concluído deve estar entre 0 e 100'),

  // ⚖️ peso precisa ser inteiro e positivo — opcional (default 1)
  body('peso')
    .optional()
    .isInt({ min: 1 })
    .withMessage('O peso deve ser um número inteiro maior que 0'),

  // ✅ Validação final de erros acumulados
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'erro_validacao',
        erros: errors.array().map(err => ({
          campo: err.param,
          mensagem: err.msg,
        })),
      });
    }
    next();
  },
];

module.exports = validateFases;
