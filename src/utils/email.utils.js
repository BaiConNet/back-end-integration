import { Resend } from 'resend';
import crypto from 'crypto';

// Gera token aleatório
export function gerarToken() {
  return crypto.randomBytes(32).toString('hex');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Envia email de confirmação
export async function enviarEmailConfirmacao(email, token, urlBase) {
  const urlConfirmacao = `${urlBase}/confirm-email?token=${token}`;

  await resend.emails.send({
    from: '"Connect Admin JWT" <noreply@resend.dev>',
    to: email,
    subject: 'Confirme seu cadastro',
    html: `
      <p>Olá! Clique no link abaixo para confirmar seu cadastro:</p>
      <a href="${urlConfirmacao}" target="_blank" style="color:#1a73e8; font-weight:bold;">
        Confirmar cadastro
      </a>
      <br /><br />
      <p>Ou copie e cole no navegador:</p>
      <p style="word-break: break-all;">${urlConfirmacao}</p>
    `,
  });
}
