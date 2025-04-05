// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  tipo: { type: String, enum: ['cliente', 'dono'] },
});

module.exports = mongoose.model('User', userSchema);