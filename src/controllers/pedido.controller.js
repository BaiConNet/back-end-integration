const Pedido = require('../models/Pedido.model');

exports.criarPedido = async (req, res) => {
  try {
    const novoPedido = new Pedido({
      clienteId: req.user.id,
      lojaId: req.body.lojaId,
      itens: req.body.itens,
      tipo: req.body.tipo
    });

    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};
