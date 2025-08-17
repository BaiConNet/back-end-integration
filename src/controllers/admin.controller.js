const Agendamento = require('../models/agendamento.model');
const Bloqueio = require('../models/bloqueio.model');
const Servico = require('../models/servico.model');
const Schedule = require('../models/schedule.model');
const User = require('../models/user.model');

// Painel geral do admin
exports.painelAdmin = async (req, res) => {
  try {
    // Agendamentos com clientes e barbeiros populados
    const agendamentos = await Agendamento.find().populate('cliente barbeiro servico');
    
    // Bloqueios
    const bloqueios = await Bloqueio.find().populate('barbeiro');
    
    // Serviços
    const servicos = await Servico.find().populate('usuario', 'nome email role');
    
    // Horários disponíveis
    const horarios = await Schedule.find().populate('barbeiro');
    
    // Usuários
    const clientes = await User.find({ role: 'CLIENTE' }).select('-senha');
    const barbeiros = await User.find({ role: 'BARBEIRO' }).select('-senha');
    
    res.status(200).json({
      agendamentos,
      bloqueios,
      servicos,
      horarios,
      clientes,
      barbeiros,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar painel admin.' });
  }
};
