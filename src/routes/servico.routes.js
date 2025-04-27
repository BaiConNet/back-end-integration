const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servico.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

router.post('/', autenticar, verificarPermissao(['ADMIN']), servicoController.criarServico);

router.get('/', autenticar, servicoController.listarServicos);

router.put('/:servicoId', autenticar, verificarPermissao(['ADMIN']), servicoController.editarServico);

router.delete('/:servicoId', autenticar, verificarPermissao(['ADMIN']), servicoController.excluirServico);

module.exports = router;
