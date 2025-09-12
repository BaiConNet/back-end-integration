const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { gerarToken, enviarEmailConfirmacao } = require('../utils/email.utils');

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

    const token = gerarToken();
    const hash = await bcrypt.hash(senha, 10);

    const novoUser = new User.create({
      nome,
      telefone,
      email,
      senha: hash,
      role,
      emailConfirmed: false,
      confirmationToken: token,
    });

    const urlBase = process.env.NODE_ENV === "sandbox"
    ? process.env.FRONTEND_URL_SANDBOX
    : process.env.FRONTEND_URL_PROD;

    await enviarEmailConfirmacao(email, token, urlBase);

    res.status(201).json({
      message: 'Cadastro realizado! Verifique seu email para confirmar.',
    });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro no cadastro' });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ confirmationToken: token });
    if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

    user.emailConfirmed = true;
    user.confirmationToken = undefined; // remove o token
    await user.save();

    res.status(200).json({ message: 'Email confirmado com sucesso!' });
  } catch (err) {
    console.error('Erro ao confirmar email:', err);
    res.status(500).json({ message: 'Erro ao confirmar email' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Bloquear login se email não confirmado
    if (!user.emailConfirmed) {
      return res.status(403).json({ message: 'Confirme seu email antes de logar' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { _id: user._id, nome: user.nome, email: user.email, telefone: user.telefone, role: user.role } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no login' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id, email } = req.query;

    let user;
    if (id) {
      user = await User.findById(id).select('-senha');
    } else if (email) {
      user = await User.findOne({ email }).select('-senha');
    } else {
      return res.status(400).json({ error: 'Informe id ou email para buscar o usuário' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-senha');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};