const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  try {
    const { nome, email, telefone, senha, role } = req.body;

    if (!nome || !telefone || !email || !senha || !role) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    // Verifica se já existe usuário
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    // Criptografa a senha
    const hash = await bcrypt.hash(senha, 10);

    const novoUser = new User({
      nome,
      telefone,
      email,
      senha: hash,
      role,
    });

    await novoUser.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro no cadastro' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, nome: user.nome, role: user.role } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no login' });
  }
};
