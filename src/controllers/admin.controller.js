exports.painelAdmin = async (req, res) => {
    try {
      const agendamentos = await Agendamento.find().populate('barbeiro cliente');
      const bloqueios = await Bloqueio.find();
      const servicos = await Servico.find();
  
      res.status(200).json({
        agendamentos,
        bloqueios,
        servicos,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao carregar painel.' });
    }
  };
  