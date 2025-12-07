const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");
const upload = require("../middlewares/multerConfig");
const validateObras = require("../middlewares/validateObra");
const verificarToken = require("../middlewares/authMiddleware"); // se você usa JWT

router.post(
  "/obras",
  verificarToken,
  upload.single("foto"), // 👈 agora o campo do form é "foto"
  validateObras,
  obraController.criarObrasControllers
);

router.get("/obras", obraController.listarObrasController);
router.get("/obras/:id", obraController.listarObraPorId);
router.put(
  "/obras/:id",
  verificarToken,
  upload.single("foto"),   // 👈 AGORA SIM!!!
  obraController.atualizarObrasController
);

router.delete("/obras/:id", verificarToken, obraController.excluirObrasController);

module.exports = router;
