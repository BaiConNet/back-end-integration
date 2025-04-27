const Agendamento = require('../models/agendamento.model');
const Bloqueio = require('../models/bloqueio.model');
const Servico = require('../models/servico.model');
const User = require('../models/user.model');

exports.criarAgendamento = async (req, res) => {
  try {
    const { cliente, barbeiro, servico, data, horaInicio, horaFim } = req.body;

    const bloqueio = await Bloqueio.findOne({
      barbeiro,
      data,
      $or: [
        { horaInicio: { $lte: horaFim }, horaFim: { $gte: horaInicio } },
      ],
    });
    
    if (bloqueio) {
      return res.status(400).json({ message: 'Horário bloqueado para esse barbeiro.' });
    }

    const agendamentoExistente = await Agendamento.findOne({
      barbeiro,
      data,
      $or: [
        { horaInicio: { $lte: horaFim }, horaFim: { $gte: horaInicio } },
      ],
    });

    if (agendamentoExistente) {
      return res.status(400).json({ message: 'O barbeiro já tem um agendamento nesse horário.' });
    }

    const servicoExistente = await Servico.findById(servico);
    if (!servicoExistente) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    const duracaoServico = servicoExistente.duracao;
    const horaInicioObj = new Date(`1970-01-01T${horaInicio}:00`);
    const horaFimObj = new Date(`1970-01-01T${horaFim}:00`);
    const duracaoAgendamento = (horaFimObj - horaInicioObj) / 60000;

    if (duracaoAgendamento < 30) {
      return res.status(400).json({ message: 'A duração mínima do agendamento é de 30 minutos.' });
    }

    const novoAgendamento = new Agendamento({
      cliente,
      barbeiro,
      servico,
      data,
      horaInicio,
      horaFim,
    });

    await novoAgendamento.save();
    return res.status(201).json({ message: 'Agendamento criado com sucesso!', novoAgendamento });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.cancelarAgendamento = async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    const agendamento = await Agendamento.findById(agendamentoId);

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    const horaCancelamento = new Date();
    const horaAgendamento = new Date(agendamento.data);
    horaAgendamento.setHours(parseInt(agendamento.horaInicio.split(':')[0]), parseInt(agendamento.horaInicio.split(':')[1]));

    const tempoRestante = (horaAgendamento - horaCancelamento) / 60000;
    if (tempoRestante < 120) {
      return res.status(400).json({ message: 'Cancelamento deve ser feito com no mínimo 2 horas de antecedência.' });
    }

    agendamento.status = 'CANCELADO';
    await agendamento.save();

    return res.status(200).json({ message: 'Agendamento cancelado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
