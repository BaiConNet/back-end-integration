const express = require('express');
const router = express.Router();
const bloqueioController = require('../controllers/bloqueio.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

router.post('/', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), bloqueioController.criarBloqueio);

router.get('/:barbeiroId', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), bloqueioController.listarBloqueios);

module.exports = router;
