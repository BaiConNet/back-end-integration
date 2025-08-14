const Servico = require('../models/servico.model');

// Criar um novo serviço
exports.criarServico = async (req, res) => {
  try {
    const { nome, duracao, preco } = req.body;

    // Verificar se o serviço já existe
    const servicoExistente = await Servico.findOne({ nome });
    if (servicoExistente) {
      return res.status(400).json({ message: 'Serviço já existe.' });
    }

    // Criar o novo serviço
    const novoServico = new Servico({ nome, duracao, preco, usuario: req.user._id });
    await novoServico.save();
    const servicoPopulado = await Servico.findById(novoServico._id).populate('usuario', 'nome email role');
    res.status(201).json({ message: 'Serviço criado com sucesso!', novoServico: servicoPopulado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar serviço.' });
  }
};

// Listar todos os serviços
exports.listarServicos = async (req, res) => {
  try {
    //const { usuarioId } = req.params;
    
    const servicos = await Servico.find({ usuario: req.user._id });
    if (!servicos.length) {
      return res.status(200).json({ message: 'Nenhum serviço encontrado.' });
    }

    res.status(201).json(servicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar serviços.' });
  }
};

// Editar um serviço
exports.editarServico = async (req, res) => {
  try {
    const { servicoId } = req.params;
    const { nome, duracao, preco } = req.body;

    const servico = await Servico.findById(servicoId);
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    servico.nome = nome || servico.nome;
    servico.duracao = duracao || servico.duracao;
    servico.preco = preco || servico.preco;

    await servico.save();

    res.status(200).json({ message: 'Serviço editado com sucesso!', servico });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao editar serviço.' });
  }
};

// Excluir um serviço
exports.excluirServico = async (req, res) => {
  try {
    const { servicoId } = req.params;

    const servico = await Servico.findOne({ _id: servicoId, usuario: req.user._id });
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    await Servico.deleteOne({ _id: servicoId });

    res.status(200).json({ message: 'Serviço excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir serviço.' });
  }
};
