const express = require("express");
const router = express.Router();
const { criarNotificacao, listarNotificacoes, marcarComoLida } = require("../controllers/notificacao.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Criar notificação (pode ser usado pelo sistema ao gerar eventos)
router.post("/", authMiddleware, criarNotificacao);

// Listar notificações do usuário logado
router.get("/", authMiddleware, listarNotificacoes);

// Marcar notificação como lida
router.patch("/:id/lida", authMiddleware, marcarComoLida);

module.exports = router;
