const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamento.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

router.post('/', autenticar, agendamentoController.criarAgendamento);

router.put('/:agendamentoId/cancelar', autenticar, agendamentoController.cancelarAgendamento);

module.exports = router;
