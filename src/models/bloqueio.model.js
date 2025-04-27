const mongoose = require('mongoose');

const bloqueioSchema = new mongoose.Schema({
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  horaInicio: {
    type: String,
    required: true,
  },
  horaFim: {
    type: String,
    required: true,
  },
  motivo: {
    type: String,
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bloqueio', bloqueioSchema);
