const Agendamento = require('../models/agendamento.model');
const Schedule = require('../models/schedule.model');
const Bloqueio = require('../models/bloqueio.model');
const Servico = require('../models/servico.model');

// Criar agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { cliente, barbeiro, horarioId, servico } = req.body;

    const horario = await Schedule.findById(horarioId);
    if (!horario || !horario.isDisponivel) {
      return res.status(400).json({ message: 'Horário não disponível.' });
    }

    const horaInicioObj = new Date(`${horario.data}T${horario.horaInicio}:00`);
    const horaFimObj = new Date(`${horario.data}T${horario.horaFim}:00`);
    if (horaInicioObj >= horaFimObj) {
      return res.status(400).json({ message: 'Horário inválido.' });
    }

    const bloqueio = await Bloqueio.findOne({
      barbeiro,
      data: horario.data,
      horaInicio: horario.horaInicio,
      horaFim: horario.horaFim
    });
    if (bloqueio) return res.status(400).json({ message: 'Horário bloqueado pelo barbeiro.' });

    const agendamentoExistente = await Agendamento.findOne({ horario: horarioId });
    if (agendamentoExistente) return res.status(400).json({ message: 'Horário já agendado.' });

    const servicoExistente = await Servico.findById(servico);
    if (!servicoExistente) return res.status(404).json({ message: 'Serviço não encontrado.' });

    const novoAgendamento = new Agendamento({ cliente, barbeiro, horario: horarioId, servico });
    await novoAgendamento.save();

    horario.isDisponivel = false;
    await horario.save();

    res.status(201).json({ message: 'Agendamento criado com sucesso!', novoAgendamento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
};

// Cancelar agendamento
exports.cancelarAgendamento = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const agendamento = await Agendamento.findById(agendamentoId).populate('horario');

    if (!agendamento) return res.status(404).json({ message: 'Agendamento não encontrado.' });

    const horaCancelamento = new Date();
    const horaAgendamento = new Date(`${agendamento.horario.data}T${agendamento.horario.horaInicio}:00`);
    const tempoRestante = (horaAgendamento - horaCancelamento) / 60000;

    if (tempoRestante < 120) {
      return res.status(400).json({ message: 'Cancelamento deve ser feito com no mínimo 2 horas de antecedência.' });
    }

    agendamento.status = 'CANCELADO';
    await agendamento.save();

    agendamento.horario.isDisponivel = true;
    await agendamento.horario.save();

    res.status(200).json({ message: 'Agendamento cancelado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cancelar agendamento.' });
  }
};

// Atualizar agendamentos
exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['AGENDADO', 'CANCELADO', 'CONCLUIDO'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }

    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    agendamento.status = status;
    await agendamento.save();

    res.json({ message: `Status atualizado para ${status}`, agendamento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status.' });
  }
};

// Listar agendamentos
exports.listarAgendamentos = async (req, res) => {
  try {
    let filtro = {};

    if (req.user.role === 'BARBEIRO') {
      filtro.barbeiro = req.user._id;
    }

    const agendamentos = await Agendamento.find(filtro)
      .populate('cliente', 'nome email')
      .populate('barbeiro', 'nome email')
      .populate('servico', 'nome preco duracao')
      .populate('horario');

    res.status(200).json(agendamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar agendamentos.' });
  }
};

// Buscar agendamento por ID
exports.buscarAgendamentoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findById(id)
      .populate('cliente', 'nome email')
      .populate('barbeiro', 'nome email')
      .populate('servico', 'nome preco duracao')
      .populate('horario');

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    // Regras de acesso
    if (
      req.user.role === 'BARBEIRO' && agendamento.barbeiro._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Acesso negado a este agendamento.' });
    }

    res.status(200).json(agendamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamento.' });
  }
};
