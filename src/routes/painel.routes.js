const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/loja.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

// Rotas públicas para registro e login de loja
router.post('/register', lojaController.register);
router.post('/login', lojaController.login);

// Rota protegida para o painel do dono
router.get('/dashboard', auth, verificarPermissao('DONO'), (req, res) => {
  res.json({ message: 'Painel do Dono acessado com sucesso!', user: req.user });
});

module.exports = router;
