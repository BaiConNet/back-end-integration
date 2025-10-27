const express = require("express");
const router = express.Router();
const { criarNotificacao, listarNotificacoes, marcarComoLida } = require("../controllers/notificacao.controller");
const { autenticar, verificarPermissao } = require("../middlewares/auth.middleware");

// Criar notificação (pode ser usado pelo sistema ao gerar eventos)
router.post("/", autenticar, verificarPermissao(['ADMIN', 'BARBEIRO']), criarNotificacao);

// Listar notificações do usuário logado
router.get("/", autenticar, verificarPermissao(['ADMIN', 'BARBEIRO']), listarNotificacoes);

// Marcar notificação como lida
router.patch("/:id/lida", verificarPermissao(['ADMIN', 'BARBEIRO']), autenticar, marcarComoLida);

module.exports = router;
