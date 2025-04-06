const Loja = require('../models/loja.model');
const gerarToken = require('../utils/gerar.token');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const loja = await Loja.create({ nome, email, senha: senhaHash, tipo });

    res.status(201).json({
      token: gerarToken(loja._id),
      loja: { id: loja._id, nome: loja.nome, tipo: loja.tipo }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar loja' });
  }
};

exports.login = async (req, res) => {
  try {
    const loja = await Loja.findOne({ email: req.body.email });
    const senhaValida = await bcrypt.compare(req.body.senha, loja.senha);

    if (!loja || !senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });

    res.json({
      token: gerarToken(loja._id),
      loja: { id: loja._id, nome: loja.nome, tipo: loja.tipo }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
