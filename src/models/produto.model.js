const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  descricao: String,
  categoria: String,
  imagem: String,
  dono: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loja: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja', required: true }
});

module.exports = mongoose.models.Produto || mongoose.model('Produto', produtoSchema);