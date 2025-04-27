const Bloqueio = require('../models/bloqueio.model');
const User = require('../models/user.model');

// Criar um bloqueio
exports.criarBloqueio = async (req, res) => {
  try {
    const { barbeiro, data, horaInicio, horaFim, motivo } = req.body;

    const user = await User.findById(barbeiro);
    if (!user) {
      return res.status(404).json({ message: 'Barbeiro não encontrado.' });
    }

    const bloqueioExistente = await Bloqueio.findOne({
      barbeiro,
      data,
      horaInicio,
      horaFim,
    });

    if (bloqueioExistente) {
      return res.status(400).json({ message: 'Este horário já está bloqueado.' });
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
      return res.status(404).json({ message: 'Nenhum bloqueio encontrado.' });
    }

    res.status(200).json(bloqueios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar bloqueios.' });
  }
};
