const User = require('../models/user.model');
const gerarToken = require('../utils/gerar.token');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const userExistente = await User.findOne({ email });
    if (userExistente) return res.status(400).json({ message: 'Usuário já existe' });

    const hash = await bcrypt.hash(senha, 10);
    const novoUser = new User({ nome, email, senha: hash, tipo });
    await novoUser.save();

    res.status(201).json({ token: gerarToken(novoUser._id), user: novoUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ message: 'Senha inválida' });

    res.status(200).json({ token: gerarToken(user._id), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};