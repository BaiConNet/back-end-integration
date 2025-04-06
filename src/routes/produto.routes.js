const express = require('express');
const router = express.Router();
const { criarProduto, listarProdutos, atualizarProduto, deletarProduto } = require('../controllers/produto.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

// Apenas DONO pode criar, atualizar e deletar produtos
router.post('/', auth, verificarPermissao('DONO'), criarProduto);
router.put('/:id', auth, verificarPermissao('DONO'), atualizarProduto);
router.delete('/:id', auth, verificarPermissao('DONO'), deletarProduto);

// Listagem de produtos pode ser pública (ou protegida, se preferir)
router.get('/', listarProdutos);

module.exports = router;
