// routes/testEmail.route.js
const express = require('express');
const { enviarEmailConfirmacao } = require('../utils/email.utils');

const router = express.Router();

router.get('/test-email', async (req, res) => {
  try {
    const emailTeste = "jhonysds2@gmail.com";
    const token = "teste123"; // pode ser qualquer string só pra testar o link

    await enviarEmailConfirmacao(emailTeste, token);

    res.json({ message: "Email de teste enviado com sucesso!" });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ error: "Falha no envio de email" });
  }
});

module.exports = router;
