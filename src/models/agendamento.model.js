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
  horario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true, // referência ao horário criado pelo barbeiro
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
