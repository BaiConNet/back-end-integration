// produtoRoutes.js
const express = require('express');
const router = express.Router();
const { criarProduto, listarProdutos } = require('../controllers/produto.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, criarProduto);
router.get('/', listarProdutos);

module.exports = router;
