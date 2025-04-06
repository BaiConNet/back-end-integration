const express = require('express');
const router = express.Router();
const { criarPedido, atualizarStatus } = require('../controllers/pedido.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

// Rota para que CLIENTE crie pedidos
router.post('/', auth, verificarPermissao('CLIENTE'), criarPedido);

// Rota para que DONO atualize o status dos pedidos
router.patch('/:id/status', auth, verificarPermissao('DONO'), atualizarStatus);

module.exports = router;
