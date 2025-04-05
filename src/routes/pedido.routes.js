const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const pedidoController = require('../controllers/pedido.controller');

router.post('/', auth, pedidoController.criarPedido);
router.patch('/:id/status', auth, pedidoController.atualizarStatus);

module.exports = router;
