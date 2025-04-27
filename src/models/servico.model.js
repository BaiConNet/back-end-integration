const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  duracao: {
    type: Number,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Servico', servicoSchema);
