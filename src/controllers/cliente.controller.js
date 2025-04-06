
const User = require('../models/user.model');

exports.pegarClientes = async (req, res) => {
  try {
    const clientes = await User.find({ tipo: 'cliente' });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};