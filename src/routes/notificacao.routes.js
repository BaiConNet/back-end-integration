const express = require("express");
const router = express.Router();
const { criarNotificacao, listarNotificacoes, marcarComoLida } = require("../controllers/notificacao.controller");
const { autenticar } = require("../middlewares/auth.middleware");

// Criar notificação (pode ser usado pelo sistema ao gerar eventos)
router.post("/", autenticar, criarNotificacao);

// Listar notificações do usuário logado
router.get("/", autenticar, listarNotificacoes);

// Marcar notificação como lida
router.patch("/:id/lida", autenticar, marcarComoLida);

module.exports = router;
