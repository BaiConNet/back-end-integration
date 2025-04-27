const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  servico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  horaInicio: {
    type: String, // ex: "14:30"
    required: true,
  },
  horaFim: {
    type: String, // ex: "15:00"
    required: true,
  },
  status: {
    type: String,
    enum: ['AGENDADO', 'CANCELADO', 'CONCLUIDO'],
    default: 'AGENDADO',
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
