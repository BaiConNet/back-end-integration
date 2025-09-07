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
const forgotRoutes = require('./src/routes/forgot-password.routes')
const healthRoutes = require('./src/routes/health.routes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://sandbox-admin-control-jwtsh.vercel.app",
  "https://admin-control-jwtsh.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Conexão com banco de dados
conectarDB();

// Rotas
app.use('/user', userRoutes);
app.use('/servico', servicoRoutes);
app.use('/bloqueio', bloqueioRoutes);
app.use('/agendamento', agendamentoRoutes);
app.use('/schedule', scheduleRoutes)
app.use('/admin', adminRoutes)
app.use('/', forgotRoutes)
app.use('/health', healthRoutes);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API do bairro está rodando 🚀');
});

// Carregar jobs
require('./src/jobs/agendamento.job');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
