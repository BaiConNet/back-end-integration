const Agendamento = require('../models/agendamento.model');
const Schedule = require('../models/schedule.model');
const Bloqueio = require('../models/bloqueio.model');
const Servico = require('../models/servico.model');
const Notificacao = require('../models/notificacao.model');
const { sendNotificationToUser } = require('../config/socket');

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

    // Atualiza disponibilidade do horário
    horario.isDisponivel = false;
    await horario.save();

    // Criar notificações no banco
    await Notificacao.create({
      usuario: barbeiro,
      mensagem: `Novo agendamento para ${servicoExistente.nome} no dia ${horario.data} às ${horario.horaInicio}.`
    });

    await Notificacao.create({
      usuario: cliente,
      mensagem: `Seu agendamento para ${servicoExistente.nome} foi confirmado para ${horario.data} às ${horario.horaInicio}.`
    });

    // Enviar notificação em tempo real via Socket.io
    sendNotificationToUser(barbeiro.toString(), {
      title: "Novo Agendamento",
      message: `Você tem um novo agendamento com ${novoAgendamento.cliente.nome || 'cliente'}`,
      agendamentoId: novoAgendamento._id,
    });

    sendNotificationToUser(cliente.toString(), {
      title: "Agendamento Confirmado",
      message: `Seu agendamento para ${servicoExistente.nome} foi confirmado!`,
      agendamentoId: novoAgendamento._id,
    });

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
    const agendamento = await Agendamento.findById(agendamentoId)
      .populate('horario')
      .populate('servico', 'nome')
      .populate('cliente', 'nome')
      .populate('barbeiro', 'nome');

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

    // Criar notificações
    await Notificacao.create({
      usuario: agendamento.barbeiro._id,
      mensagem: `Agendamento de ${agendamento.servico.nome} no dia ${agendamento.horario.data} às ${agendamento.horario.horaInicio} foi cancelado.`
    });

    await Notificacao.create({
      usuario: agendamento.cliente._id,
      mensagem: `Você cancelou o agendamento de ${agendamento.servico.nome} no dia ${agendamento.horario.data} às ${agendamento.horario.horaInicio}.`
    });

    // Notificações em tempo real
    sendNotificationToUser(agendamento.barbeiro._id.toString(), {
      title: "Agendamento Cancelado",
      message: `O agendamento de ${agendamento.servico.nome} foi cancelado.`,
      agendamentoId: agendamento._id,
    });

    sendNotificationToUser(agendamento.cliente._id.toString(), {
      title: "Agendamento Cancelado",
      message: `Você cancelou seu agendamento de ${agendamento.servico.nome}.`,
      agendamentoId: agendamento._id,
    });

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

    const agendamento = await Agendamento.findById(id)
      .populate('cliente', 'nome')
      .populate('barbeiro', 'nome')
      .populate('servico', 'nome');

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    agendamento.status = status;
    await agendamento.save();

    // Notificação de mudança de status
    await Notificacao.create({
      usuario: agendamento.cliente._id,
      mensagem: `O status do seu agendamento para ${agendamento.servico.nome} foi alterado para ${status}.`
    });

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

    if (req.query.data) {
      const filtroData = new Date(req.query.data);
      filtroData.setHours(0, 0, 0, 0);
      const filtroDataFim = new Date(req.query.data);
      filtroDataFim.setHours(23, 59, 59, 999);

      const horariosIds = await Schedule.find({
        data: { $gte: filtroData, $lte: filtroDataFim }
      }).distinct('_id');

      filtro.horario = { $in: horariosIds };
    }

    const agendamentos = await Agendamento.find(filtro)
      .populate('cliente', 'nome email')
      .populate('barbeiro', 'nome email')
      .populate('servico', 'nome preco duracao')
      .populate('horario');

    res.status(200).json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
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
