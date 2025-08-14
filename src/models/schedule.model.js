const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  data: {
    type: Date, // data real do horário
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
  isDisponivel: {
    type: Boolean,
    default: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
