// Produto.js
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  descricao: String,
  categoria: String,
  imagem: String,
  dono: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Produto', produtoSchema);