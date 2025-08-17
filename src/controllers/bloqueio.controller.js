const Bloqueio = require('../models/bloqueio.model');
const User = require('../models/user.model');
const Schedule = require('../models/schedule.model'); // importa o Schedule também

// Criar um bloqueio
exports.criarBloqueio = async (req, res) => {
  try {
    const { barbeiro, data, horaInicio, horaFim, motivo } = req.body;

    const user = await User.findById(barbeiro);
    if (!user) {
      return res.status(404).json({ message: 'Barbeiro não encontrado.' });
    }

    // Validação de sobreposição de intervalos
    const conflito = await Bloqueio.findOne({
      barbeiro,
      data,
      $or: [
        { horaInicio: { $lt: horaFim }, horaFim: { $gt: horaInicio } }
      ]
    });

    if (conflito) {
      return res.status(400).json({ message: 'Já existe bloqueio nesse intervalo.' });
    }
    
    // Criar o bloqueio
    const novoBloqueio = new Bloqueio({
      barbeiro,
      data,
      horaInicio,
      horaFim,
      motivo,
    });

    await novoBloqueio.save();

    // Atualizar os horários do Schedule que estão dentro do bloqueio
    await Schedule.updateMany(
      {
        barbeiro,
        data,
        horaInicio: { $gte: horaInicio },
        horaFim: { $lte: horaFim },
      },
      { $set: { isDisponivel: false } }
    );

    res.status(201).json({ message: 'Bloqueio criado com sucesso!', novoBloqueio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar bloqueio.' });
  }
};

exports.listarBloqueios = async (req, res) => {
  try {
    const bloqueios = await Bloqueio.find({ barbeiro: req.params.barbeiroId });

    if (!bloqueios.length) {
      return res.status(200).json({ message: 'Nenhum bloqueio encontrado.' });
    }

    res.status(201).json(bloqueios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar bloqueios.' });
  }
};

// Excluir bloqueio
exports.excluirBloqueio = async (req, res) => {
  try {
    const { bloqueioId } = req.params;

    const bloqueio = await Bloqueio.findById(bloqueioId);
    if (!bloqueio) {
      return res.status(404).json({ message: 'Bloqueio não encontrado.' });
    }

    // Remove o bloqueio
    await Bloqueio.findByIdAndDelete(bloqueioId);

    // Reabilitar horários que estavam bloqueados
    await Schedule.updateMany(
      {
        barbeiro: bloqueio.barbeiro,
        data: bloqueio.data,
        horaInicio: { $gte: bloqueio.horaInicio },
        horaFim: { $lte: bloqueio.horaFim },
      },
      { $set: { isDisponivel: true } }
    );

    res.status(200).json({ message: 'Bloqueio excluído e horários liberados com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir bloqueio.' });
  }
};