const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['CLIENTE', 'BARBEIRO', 'ADMIN'],
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  emailConfirmed: { type: Boolean, default: false },
  confirmationToken: { type: String }
});

module.exports = mongoose.model('User', userSchema);