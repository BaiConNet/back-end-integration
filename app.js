const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swagger.config');

const conectarDB = require('./config/db');
const userRoutes = require('./src/routes/user.routes');
const servicoRoutes = require('./src/routes/servico.routes');
const bloqueioRoutes = require('./src/routes/bloqueio.routes');
const agendamentoRoutes = require('./src/routes/agendamento.routes');
const adminRoutes = require('./src/routes/admin.routes');
const scheduleRoutes = require('./src/routes/schedule.routes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexão com banco de dados
conectarDB();

// Rotas
app.use('/user', userRoutes);
app.use('/servico', servicoRoutes);
app.use('/bloqueio', bloqueioRoutes);
app.use('/agendamento', agendamentoRoutes);
app.use('/schedule', scheduleRoutes)
app.use('/admin', adminRoutes)

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API do bairro está rodando 🚀');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
