const { body, validationResult } = require("express-validator");

const validateCotacao = [
  body("produto_id")
    .isInt()
    .withMessage("Produto ID deve ser um número inteiro"),
  body("fornecedor_id")
    .isInt()
    .withMessage("Fornecedor ID deve ser um número inteiro"),
  body("preco")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser maior ou igual a 0"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateCotacao;