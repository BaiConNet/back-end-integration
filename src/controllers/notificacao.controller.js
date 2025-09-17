const Notificacao = require("../models/notificacao.model");

// Criar notificação
exports.criarNotificacao = async (req, res) => {
  try {
    const { usuario, mensagem } = req.body;
    const notificacao = await Notificacao.create({ usuario, mensagem });
    res.status(201).json(notificacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar notificação" });
  }
};

// Listar notificações de um usuário
exports.listarNotificacoes = async (req, res) => {
  try {
    const userId = req.user.id; // vem do token JWT
    const notificacoes = await Notificacao.find({ usuario: userId }).sort({ criadoEm: -1 });
    res.json(notificacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar notificações" });
  }
};

// Marcar como lida
exports.marcarComoLida = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacao = await Notificacao.findByIdAndUpdate(id, { lida: true }, { new: true });
    if (!notificacao) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }
    res.json(notificacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao marcar notificação como lida" });
  }
};
