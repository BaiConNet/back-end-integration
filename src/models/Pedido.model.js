const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  lojaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja' },
  itens: [
    {
      produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
      quantidade: Number
    }
  ],
  tipo: { type: String, enum: ['pedido', 'orcamento'] },
  status: { type: String, enum: ['pendente', 'aceito', 'rejeitado', 'concluido'], default: 'pendente' },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
