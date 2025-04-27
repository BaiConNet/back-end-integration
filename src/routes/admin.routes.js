const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

router.get('/painel', autenticar, verificarPermissao(['ADMIN']), adminController.painelAdmin);

module.exports = router;
