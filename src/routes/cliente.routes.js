// clienteRoutes.js
const express = require('express');
const router = express.Router();
const { pegarClientes } = require('../controllers/cliente.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, pegarClientes);

module.exports = router;