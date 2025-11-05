require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
};

const express = require('express');
const app = express();
const cors = require('cors')
const path = require("path");

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));




// Rotas de autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Rotas protegidas
const cotacoesRoutes = require('./routes/cotacaoRoutes');
const entradasRoutes = require('./routes/entradaRoutes');
const fasesRoutes = require('./routes/faseRoutes');
const orcamentosRoutes = require('./routes/orcamentoRoutes');
const usuariosRoutes = require('./routes/usuarioRoutes');
const saidasRoutes = require('./routes/saidaRoutes');
const transferenciasRoutes = require('./routes/transferenciaRoutes');
const produtosRoutes = require('./routes/produtoRoutes');
const fornecedoresRoutes = require('./routes/fornecedorRoutes');
const obrasRoutes = require('./routes/obraRoutes');
const estoquePorObraRoutes = require('./routes/estoquePorObraRoutes');

app.use('/api', cotacoesRoutes);
app.use('/api', entradasRoutes);
app.use('/api', fasesRoutes);
app.use('/api', orcamentosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', saidasRoutes);
app.use('/api', transferenciasRoutes);
app.use('/api', produtosRoutes);
app.use('/api', fornecedoresRoutes);
app.use('/api', obrasRoutes);
app.use('/api', estoquePorObraRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


