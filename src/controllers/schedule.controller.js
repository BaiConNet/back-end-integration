const mongoose = require('mongoose');
const Schedule = require('../models/schedule.model');
const Bloqueio = require('../models/bloqueio.model');

// Criar horário disponível
exports.criarHorario = async (req, res) => {
  try {
    const { data, horaInicio, horaFim } = req.body;
    const barbeiro = req.user._id;

    if (horaInicio >= horaFim) {
      return res.status(400).json({ message: 'Hora de início deve ser menor que hora de fim.' });
    }

    const conflito = await Schedule.findOne({
      barbeiro,
      data,
      $or: [
        { horaInicio: { $lt: horaFim }, horaFim: { $gt: horaInicio } }
      ]
    });

    if (conflito) return res.status(400).json({ message: 'Já existe um horário cadastrado nesse período.' });

    const novoHorario = new Schedule({ barbeiro, data, horaInicio, horaFim, isDisponivel: true });
    await novoHorario.save();

    res.status(201).json({ message: 'Horário criado com sucesso!', novoHorario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar horário.' });
  }
};

// Listar horários disponíveis de um barbeiro
exports.listarHorarios = async (req, res) => {
  try {
    const barbeiroId = req.params.barbeiroId;
    const horarios = await Schedule.find({ barbeiro: barbeiroId }).sort({ data: 1, horaInicio: 1 });
    res.status(200).json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar horários.' });
  }
};

// Editar horário (somente dono ou admin)
exports.editarHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    const { data, horaInicio, horaFim, isDisponivel } = req.body;

    const horario = await Schedule.findById(horarioId);
    if (!horario) return res.status(404).json({ message: 'Horário não encontrado.' });

    if (horario.barbeiro.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Ação não permitida.' });
    }

    if (horaInicio && horaFim && horaInicio >= horaFim) {
      return res.status(400).json({ message: 'Hora de início deve ser menor que hora de fim.' });
    }

    horario.data = data || horario.data;
    horario.horaInicio = horaInicio || horario.horaInicio;
    horario.horaFim = horaFim || horario.horaFim;
    if (isDisponivel !== undefined) horario.isDisponivel = isDisponivel;

    await horario.save();
    res.status(200).json({ message: 'Horário editado com sucesso!', horario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao editar horário.' });
  }
};

// Excluir horário (somente dono ou admin)
exports.excluirHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(horarioId)) {
      return res.status(400).json({ message: 'ID de horário inválido.' });
    }

    const horario = await Schedule.findById(horarioId);
    if (!horario) return res.status(404).json({ message: 'Horário não encontrado.' });

    // Verificar permissão
    if (horario.barbeiro.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Ação não permitida.' });
    }

    await Schedule.findByIdAndDelete(horarioId);
    res.status(200).json({ message: 'Horário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    res.status(500).json({ message: 'Erro ao excluir horário.' });
  }
};
