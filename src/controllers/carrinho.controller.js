const Carrinho = require('../models/carrinho.model');
const Pedido = require('../models/pedido.model');
const Produto = require('../models/produto.model');

exports.adicionarItem = async (req, res) => {
  const userId = req.userId;
  const { produtoId, quantidade } = req.body;

  try {
    let carrinho = await Carrinho.findOne({ cliente: userId });

    if (!carrinho) {
      carrinho = new Carrinho({ cliente: userId, itens: [] });
    }

    const index = carrinho.itens.findIndex(item => item.produto.toString() === produtoId);

    if (index > -1) {
      carrinho.itens[index].quantidade += quantidade;
    } else {
      carrinho.itens.push({ produto: produtoId, quantidade });
    }

    await carrinho.save();
    res.status(200).json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarQuantidade = async (req, res) => {
  const userId = req.userId;
  const { produtoId } = req.params;
  const { quantidade } = req.body;

  try {
    const carrinho = await Carrinho.findOne({ cliente: userId });

    if (!carrinho) return res.status(404).json({ message: 'Carrinho não encontrado' });

    const item = carrinho.itens.find(item => item.produto.toString() === produtoId);
    if (!item) return res.status(404).json({ message: 'Produto não está no carrinho' });

    item.quantidade = quantidade;
    await carrinho.save();

    res.json({ message: 'Quantidade atualizada', carrinho });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removerItem = async (req, res) => {
  const userId = req.userId;
  const { produtoId } = req.params;

  try {
    const carrinho = await Carrinho.findOne({ cliente: userId });

    if (!carrinho) return res.status(404).json({ message: 'Carrinho não encontrado' });

    carrinho.itens = carrinho.itens.filter(item => item.produto.toString() !== produtoId);
    await carrinho.save();

    res.json({ message: 'Item removido', carrinho });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verCarrinho = async (req, res) => {
  const userId = req.userId;

  try {
    const carrinho = await Carrinho.findOne({ cliente: userId }).populate('itens.produto');

    if (!carrinho) return res.status(404).json({ message: 'Carrinho não encontrado' });

    res.json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkout = async (req, res) => {
  const userId = req.userId;

  try {
    const carrinho = await Carrinho.findOne({ cliente: userId }).populate('itens.produto');

    if (!carrinho || carrinho.itens.length === 0) {
      return res.status(400).json({ message: 'Carrinho está vazio' });
    }

    const pedidosPorLoja = {};
    for (const item of carrinho.itens) {
      const lojaId = item.produto.dono.toString();
      if (!pedidosPorLoja[lojaId]) {
        pedidosPorLoja[lojaId] = [];
      }
      pedidosPorLoja[lojaId].push({
        produto: item.produto._id,
        quantidade: item.quantidade
      });
    }

    const pedidosCriados = [];

    for (const lojaId in pedidosPorLoja) {
      const itens = pedidosPorLoja[lojaId];

      let total = 0;
      for (const item of itens) {
        const produto = await Produto.findById(item.produto);
        total += produto.preco * item.quantidade;
      }

      const pedido = new Pedido({
        cliente: userId,
        loja: lojaId,
        itens,
        total
      });

      await pedido.save();
      pedidosCriados.push(pedido);
    }

    carrinho.itens = [];
    await carrinho.save();

    res.status(201).json({
      message: 'Pedido(s) criado(s) com sucesso!',
      pedidos: pedidosCriados
    });

  } catch (err) {
    console.error('Erro no checkout:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
    const clienteId = req.user.id;
    try {
      const cart = await Cart.findOne({ cliente: clienteId }).populate('items.produto');
      if (!cart) return res.status(200).json({ items: [] });
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };