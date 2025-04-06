// src/controllers/dashboard.controller.js
const Pedido = require('../models/pedido.model');
const Produto = require('../models/produto.model');
const Loja = require('../models/loja.model');

exports.getResumoDashboard = async (req, res) => {
  try {
    const lojaId = req.userId; // Assume que req.userId é o ID da loja (dono logado)

    // Verifica se o usuário é uma loja
    const loja = await Loja.findById(lojaId);
    if (!loja) {
      return res.status(403).json({ message: 'Acesso negado: usuário não é uma loja' });
    }

    // Pedidos por status
    const statusCount = await Pedido.aggregate([
      { $match: { loja: loja._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total de vendas (somente pedidos concluídos)
    const totalVendasData = await Pedido.aggregate([
      { $match: { loja: loja._id, status: 'concluído' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalVendas = totalVendasData[0]?.total || 0;

    // Produtos mais vendidos
    const produtosMaisVendidos = await Pedido.aggregate([
      { $match: { loja: loja._id, status: 'concluído' } },
      { $unwind: '$itens' },
      {
        $group: {
          _id: '$itens.produto',
          totalVendidos: { $sum: '$itens.quantidade' }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'produtos',
          localField: '_id',
          foreignField: '_id',
          as: 'produto'
        }
      },
      { $unwind: '$produto' },
      {
        $project: {
          nome: '$produto.nome',
          totalVendidos: 1
        }
      }
    ]);

    // Últimos pedidos
    const ultimosPedidos = await Pedido.find({ loja: loja._id })
      .sort({ criadoEm: -1 })
      .limit(5)
      .populate('cliente', 'nome')
      .populate('itens.produto', 'nome');

    return res.json({
      statusCount,
      totalVendas,
      produtosMaisVendidos,
      ultimosPedidos,
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    res.status(500).json({ message: 'Erro ao carregar dashboard' });
  }
};
