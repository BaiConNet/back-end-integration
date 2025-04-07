const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  loja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  },
  itens: [
    {
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
      },
      quantidade: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['AGUARDANDO', 'CONFIRMADO', 'PREPARANDO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO'],
    default: 'AGUARDANDO'
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema);

