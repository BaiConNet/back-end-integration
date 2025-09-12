import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Gera token aleatório
export function gerarToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Envia email de confirmação
export async function enviarEmailConfirmacao(email, token, urlBase) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const urlConfirmacao = `${urlBase}/confirm-email?token=${token}`;

  await transporter.sendMail({
    from: '"Connect Admin JWT" <noreply@barber.com>',
    to: email,
    subject: 'Confirme seu cadastro',
    html: `
      <p>Olá! Clique no link abaixo para confirmar seu cadastro:</p>
      <a href="${urlConfirmacao}">Confirmar cadastro</a>
    `,
  });
}
