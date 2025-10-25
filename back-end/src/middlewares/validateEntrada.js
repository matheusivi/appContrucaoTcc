const { body, validationResult } = require("express-validator");

const validateEntrada = [
  body("produto_id")
    .isInt()
    .withMessage("Produto ID deve ser um número inteiro"),
  body("quantidade")
    .isInt()
    .withMessage("Quantidade deve ser um número inteiro"),
  body("fornecedor_id")
    .isInt()
    .withMessage("Fornecedor ID deve ser um número inteiro"),
  body("preco_unitario")
    .isFloat()
    .withMessage("Preço unitário deve ser um número"),
  body("obra_id")
    .optional()
    .isInt()
    .withMessage("Obra ID deve ser um número inteiro"),
  body("nota_fiscal")
    .optional()
    .isString()
    .withMessage("Nota fiscal deve ser uma string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEntrada;
