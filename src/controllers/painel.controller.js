const Produto = require('../models/produto.model');
const Pedido = require('../models/pedido.model');

exports.getPainel = async (req, res) => {
  try {
    const lojaId = req.user.id;

    const produtos = await Produto.find({ lojaId });
    const pedidos = await Pedido.find({ lojaId }).populate('clienteId');

    res.json({ produtos, pedidos });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar painel' });
  }
};
