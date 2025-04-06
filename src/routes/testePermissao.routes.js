const express = require('express');
const router = express.Router();

// Importa os middlewares
const auth = require('../middleware/auth.middleware'); // Verifica token
const verificarPermissao = require('../middleware/role.middleware'); // Verifica papel

// Só DONO pode acessar
router.get('/painel', auth, verificarPermissao('DONO'), (req, res) => {
  res.json({ message: 'Painel do Dono acessado com sucesso!' });
});

// Só CLIENTE pode acessar
router.get('/perfil-cliente', auth, verificarPermissao('CLIENTE'), (req, res) => {
  res.json({ message: 'Perfil do Cliente acessado com sucesso!' });
});

// Só ADMIN pode acessar
router.get('/admin-dashboard', auth, verificarPermissao('ADMIN'), (req, res) => {
  res.json({ message: 'Painel de Administração acessado!' });
});

module.exports = router;
