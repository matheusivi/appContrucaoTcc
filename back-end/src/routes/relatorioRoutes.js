const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ROTA DE GASTO MENSAL
router.get('/gastos/obra/:obra_id/mensal', authMiddleware, async (req, res) => {
  try {
    const obra_id = Number(req.params.obra_id);

    if (isNaN(obra_id)) {
      return res.status(400).json({ error: 'ID da obra inválido' });
    }

    const entradas = await prisma.entradas.findMany({
      where: { obra_id },
      select: {
        quantidade: true,
        preco_unitario: true,
        data_entrada: true
      }
    });

    const agrupado = {};
    let totalGeral = 0;

    entradas.forEach((item) => {
      const data = new Date(item.data_entrada);
      const chaveMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

      const gasto = item.quantidade * item.preco_unitario;

      if (!agrupado[chaveMes]) agrupado[chaveMes] = 0;
      agrupado[chaveMes] += gasto;

      totalGeral += gasto;
    });

    const resultadoMensal = Object.keys(agrupado)
      .sort()
      .map((mes) => ({
        mes,
        total_gasto: agrupado[mes]
      }));

    res.json({
      total_geral: totalGeral,
      mensal: resultadoMensal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar gastos mensais' });
  }
});

module.exports = router;
