import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { gerarToken } from "../utils/email.utils.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// === Solicitação de recuperação de senha ===
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Gerar token e salvar no usuário
    const resetToken = gerarToken();
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // URL para redefinir senha
    const resetUrl = `https://admin-control-jwtsh.vercel.app/reset-password/${resetToken}`;

    // === Template no mesmo layout do e-mail de confirmação ===
    const emailData = {
      sender: {
        email: "connect.jwtsofthouse@gmail.com",
        name: "JWT Soft House",
      },
      to: [{ email: user.email }],
      subject: "Recuperação de Senha - AppBarber",
      htmlContent: `
  <div style="
    background-color: #000000;
    color: #ffffff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 40px 20px;
    text-align: center;
  ">
    <!-- Logo -->
    <img src="https://sandbox-back-end-integration.onrender.com/src/img/barber_shop_logo_white.png" 
      alt="AppBarber Logo" 
      style="width: 120px; margin-bottom: 20px;" />

    <!-- Título -->
    <h1 style="
      font-size: 24px; 
      font-weight: 600; 
      margin-bottom: 10px;
    ">
      Recuperação de Senha
    </h1>

    <!-- Mensagem -->
    <p style="
      font-size: 16px; 
      color: #cccccc; 
      margin-bottom: 30px;
    ">
      Recebemos uma solicitação para redefinir sua senha.<br>
      Para continuar, clique no botão abaixo e crie uma nova senha:
    </p>

    <!-- Botão -->
    <a href="${resetUrl}" target="_blank"
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
      Redefinir Senha
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
      ${resetUrl}
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
      Este link é válido por 1 hora.<br>
      Se você não solicitou a redefinição, ignore este e-mail.
    </p>

    <p style="
      font-size: 12px;
      color: #666;
      margin-top: 20px;
    ">
      © ${new Date().getFullYear()} AppBarber. Todos os direitos reservados.
    </p>
  </div>
`,
    };

    await emailApi.sendTransacEmail(emailData);

    res.json({ message: "E-mail de recuperação enviado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail de recuperação:", err);
    res.status(500).json({ message: "Erro ao enviar e-mail de recuperação" });
  }
};

// === Redefinir senha ===
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).json({ message: "Informe a nova senha" });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    user.senha = await bcrypt.hash(senha, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao redefinir senha:", err);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
};
