const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
});

const carrinhoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
    unique: true
  },
  itens: [itemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Carrinho', carrinhoSchema);
