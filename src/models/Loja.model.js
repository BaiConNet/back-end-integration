const mongoose = require('mongoose');

const LojaSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  tipo: String, // Ex: oficina, pizzaria, mercearia, etc.
});

module.exports = mongoose.model('Loja', LojaSchema);
