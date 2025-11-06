import SibApiV3Sdk from "sib-api-v3-sdk";

// Configuração do cliente Sendinblue
const apiClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = apiClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Função para gerar o token (mantém igual)
export function gerarToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Função para enviar o e-mail de confirmação usando Sendinblue
export async function enviarEmailConfirmacao(email, token, urlBase) {
  const urlConfirmacao = `${urlBase}/confirm-email?token=${token}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = {
    email: "noreply@barber.com",
    name: "Connect Admin JWT",
  };
  sendSmtpEmail.to = [{ email: email }];
  sendSmtpEmail.subject = "Confirme seu cadastro";
  sendSmtpEmail.htmlContent = `
    <p>Olá! Clique no link abaixo para confirmar seu cadastro:</p>
    <a href="${urlConfirmacao}" target="_blank" style="color:#1a73e8; font-weight:bold;">
      Confirmar cadastro
    </a>
    <br /><br />
    <p>Ou copie e cole no navegador:</p>
    <p style="word-break: break-all;">${urlConfirmacao}</p>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("E-mail de confirmação enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw new Error("Erro ao enviar e-mail de confirmação");
  }
}
