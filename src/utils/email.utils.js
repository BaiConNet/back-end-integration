// src/utils/email.utils.js

import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import crypto from "crypto";

// Carrega variáveis de ambiente
dotenv.config();

// === Configuração do cliente Sendinblue === //
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

// Instância da API de e-mails transacionais
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// === Função para gerar token seguro === //
export function gerarToken() {
  try {
    return crypto.randomBytes(32).toString("hex");
  } catch (error) {
    console.error("❌ Erro ao gerar token:", error);
    throw new Error("Falha ao gerar token de verificação");
  }
}

// === Função para enviar o e-mail de confirmação === //
export async function enviarEmailConfirmacao(email, token, urlBase) {
  const urlConfirmacao = `${urlBase}/confirm-email?token=${token}`;

  // Corpo do e-mail
  const emailData = {
    sender: {
      email: "connect.jwtsofthouse@gmail.com",
      name: "JWT Soft House",
    },
    to: [{ email }],
    subject: "Confirme seu cadastro",
    htmlContent: `
  <div style="
    background-color: #000000;
    color: #ffffff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 40px 20px;
    text-align: center;
  ">
    <!-- Logo -->
    <img src="https://sandbox-back-end-integration.onrender.com/src/img/barber_shop_logo_white.png" alt="AppBarber Logo" 
      style="width: 120px; margin-bottom: 20px;" />

    <!-- Título -->
    <h1 style="
      font-size: 24px; 
      font-weight: 600; 
      margin-bottom: 10px;
    ">
      Bem-vindo ao AppBarber!
    </h1>

    <!-- Mensagem -->
    <p style="
      font-size: 16px; 
      color: #cccccc; 
      margin-bottom: 30px;
    ">
      Para concluir seu cadastro, confirme seu e-mail clicando no botão abaixo:
    </p>

    <!-- Botão -->
    <a href="${urlConfirmacao}" target="_blank"
      style="
        display: inline-block;
        background-color: #ffffff;
        color: #000000;
        padding: 14px 28px;
        border-radius: 10px;
        font-weight: bold;
        text-decoration: none;
        transition: all 0.3s ease;
      ">
      Confirmar Cadastro
    </a>

    <!-- Alternativa -->
    <p style="
      font-size: 14px; 
      color: #888888; 
      margin-top: 40px;
    ">
      Ou copie e cole o link abaixo no seu navegador:
    </p>

    <p style="
      font-size: 13px; 
      color: #aaaaaa;
      word-break: break-all;
      margin: 10px auto;
      max-width: 90%;
    ">
      ${urlConfirmacao}
    </p>

    <hr style="
      border: none;
      border-top: 1px solid #222;
      margin: 40px 0 20px;
    ">

    <p style="
      font-size: 12px;
      color: #666;
    ">
      © ${new Date().getFullYear()} AppBarber. Todos os direitos reservados.
    </p>
  </div>
`,
  };

  // Log para debug (ajuda em caso de falha)
  console.log("📨 Enviando e-mail de confirmação para:", email);
  console.log("🔗 URL de confirmação:", urlConfirmacao);

  try {
    const response = await emailApi.sendTransacEmail(emailData);
    console.log("✅ E-mail de confirmação enviado com sucesso!");
    console.log("🪶 Resposta Sendinblue:", response);
  } catch (error) {
    // Exibe o erro completo para facilitar o diagnóstico
    console.error("❌ Erro ao enviar e-mail via Sendinblue:");
    console.error(error.response?.body || error.message || error);
    throw new Error("Erro ao enviar e-mail de confirmação");
  }
}
