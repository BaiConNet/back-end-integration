const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');
const carrinhoController  = require('../controllers/carrinho.controller');

// Somente CLIENTE pode gerenciar seu carrinho
router.use(auth, verificarPermissao('CLIENTE'));

router.get('/', auth, verificarPermissao('CLIENTE'), carrinhoController.verCarrinho);
router.post('/adicionar', auth, verificarPermissao('CLIENTE'), carrinhoController.adicionarItem);
router.put('/atualizar/:produtoId', auth, verificarPermissao('CLIENTE'), carrinhoController.atualizarQuantidade);
router.delete('/remover/:produtoId', auth, verificarPermissao('CLIENTE'), carrinhoController.removerItem);
router.post('/checkout', auth, verificarPermissao('CLIENTE'), carrinhoController.checkout);

module.exports = router;
