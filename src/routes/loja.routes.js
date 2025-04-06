const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/loja.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

// Registro e login de loja (público)
router.post('/register', lojaController.register);
router.post('/login', lojaController.login);

// Exemplo: rota para atualizar informações da loja (só para DONO)
// router.put('/update', auth, verificarPermissao('DONO'), lojaController.updateLoja);

module.exports = router;
