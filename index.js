const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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

// Swagger config
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Bairro',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de comércio local',
    },
    servers: [
      {
        url: 'http://localhost:3000', // depois trocamos para domínio real
      },
    ],
  },
  apis: ['./src/routes/*.js'], // escaneia seus arquivos de rota
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/auth', authRoutes);
app.use('/cliente', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/painel', painelRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/loja', lojaRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/teste', testePermissaoRoutes);

app.get('/', (req, res) => {
  res.send('API do bairro está rodando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
