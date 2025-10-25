const express = require('express');
const { createTransferencia } = require('../controllers/transferenciaController');
const validateTransferencia = require('../middlewares/validateTransferencia');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/transferencia', authMiddleware, validateTransferencia, createTransferencia);

module.exports = router;