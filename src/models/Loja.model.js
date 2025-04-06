const mongoose = require('mongoose');

const LojaSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  tipo: String, // Ex: oficina, pizzaria, mercearia, etc.
  dono: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja', // ou 'Usuario' se você tiver um model separado para os donos
    required: false
  }
});

module.exports = mongoose.models.Loja || mongoose.model('Loja', LojaSchema);
