const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swagger.config');

// Rotas
const testEmailRoutes = require('./src/routes/testeEmail.routes');
const userRoutes = require('./src/routes/user.routes');
const servicoRoutes = require('./src/routes/servico.routes');
const bloqueioRoutes = require('./src/routes/bloqueio.routes');
const agendamentoRoutes = require('./src/routes/agendamento.routes');
const adminRoutes = require('./src/routes/admin.routes');
const scheduleRoutes = require('./src/routes/schedule.routes');
const forgotRoutes = require('./src/routes/forgot-password.routes');
const healthRoutes = require('./src/routes/health.routes');
const notificacao = require('./src/routes/notificacao.routes');

// Socket
const { initSocket } = require('./src/config/socket');

dotenv.config();
const conectarDB = require('./config/db');

// App express
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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors());

// Conexão com DB
conectarDB();

// Rotas
app.use('/user', userRoutes);
app.use('/servico', servicoRoutes);
app.use('/bloqueio', bloqueioRoutes);
app.use('/agendamento', agendamentoRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/admin', adminRoutes);
app.use('/', forgotRoutes);
app.use('/health', healthRoutes);
app.use('/api', testEmailRoutes);
app.use('/notificacoes', notificacao);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API do bairro está rodando 🚀');
});

// Jobs
require('./src/jobs/agendamento.job');

// Tratamento de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

// Criar server HTTP
const server = http.createServer(app);

// Inicializa Socket.io
initSocket(server);

// Inicia servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
