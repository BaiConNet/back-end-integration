const express = require('express');
const router = express.Router();
const { pegarClientes } = require('../controllers/cliente.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

// Essa rota só pode ser acessada por usuários com role "CLIENTE"
router.get('/', auth, verificarPermissao('CLIENTE'), pegarClientes);

module.exports = router;
