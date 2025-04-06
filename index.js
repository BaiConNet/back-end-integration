// index.js
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

const conectarDB = require('./config/db');
const authRoutes = require('./src/routes/auth.routes');
const clienteRoutes = require('./src/routes/cliente.routes');
const produtoRoutes = require('./src/routes/produto.routes');
const painelRoutes = require('./src/routes/painel.routes');
const pedidoRoutes = require('./src/routes/pedido.routes');
const lojaRoutes = require('./src/routes/loja.routes');
const cartRoutes = require('./src/routes/carrinho.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const testePermissaoRoutes = require('./src/routes/testePermissao.routes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexão com banco de dados
conectarDB();

// Rotas
app.use('/auth', authRoutes);
app.use('/cliente', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/painel', painelRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/loja', lojaRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);

// teste
app.use('/teste', testePermissaoRoutes);

app.get('/', (req, res) => {
  res.send('API do bairro está rodando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
