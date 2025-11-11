import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import User from "../models/user.model.js";
import { gerarToken } from "../utils/email.utils.js";

dotenv.config();

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * === Solicitação de recuperação de senha ===
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "E-mail é obrigatório" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // 🔹 Define a URI de acordo com o ambiente
    const uri = process.env.FRONTEND_URL || "http://localhost:5173";
    console.log(
      `🔹 Ambiente atual: ${process.env.NODE_ENV || "development"}\nFrontend conectado: ${uri}`
    );

    // 🔹 Gera token e salva hash + expiração
    const resetToken = gerarToken();
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hora
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${uri}/reset-password/${resetToken}`;

    // === Template de E-mail ===
    const emailData = {
      sender: {
        email: "connect.jwtsofthouse@gmail.com",
        name: "JWT Soft House",
      },
      to: [{ email: user.email }],
      subject: "Recuperação de Senha - AppBarber",
      htmlContent: `
        <div style="background-color:#000;color:#fff;font-family:Helvetica,Arial,sans-serif;padding:40px 20px;text-align:center;">
          <img src="https://sandbox-back-end-integration.onrender.com/src/img/barber_shop_logo_white.png" 
               alt="AppBarber Logo" style="width:120px;margin-bottom:20px;" />
          <h1 style="font-size:24px;font-weight:600;margin-bottom:10px;">Recuperação de Senha</h1>
          <p style="font-size:16px;color:#ccc;margin-bottom:30px;">
            Recebemos uma solicitação para redefinir sua senha.<br>
            Clique no botão abaixo para criar uma nova senha:
          </p>
          <a href="${resetUrl}" target="_blank"
             style="display:inline-block;background:#fff;color:#000;padding:14px 28px;border-radius:10px;
                    font-weight:bold;text-decoration:none;transition:all 0.3s;">
            Redefinir Senha
          </a>
          <p style="font-size:14px;color:#888;margin-top:40px;">Ou copie o link abaixo:</p>
          <p style="font-size:13px;color:#aaa;word-break:break-all;margin:10px auto;max-width:90%;">${resetUrl}</p>
          <hr style="border:none;border-top:1px solid #222;margin:40px 0 20px;">
          <p style="font-size:12px;color:#666;">Link válido por 1 hora.<br>Se não foi você, ignore este e-mail.</p>
          <p style="font-size:12px;color:#666;margin-top:20px;">
            © ${new Date().getFullYear()} AppBarber. Todos os direitos reservados.
          </p>
        </div>`,
    };

    await emailApi.sendTransacEmail(emailData);

    res
      .status(200)
      .json({ message: "E-mail de recuperação enviado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail de recuperação:", err);
    res.status(500).json({ message: "Erro ao enviar e-mail de recuperação" });
  }
};

/**
 * === Redefinir senha ===
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token ausente" });
    }
    if (!senha) {
      return res.status(400).json({ message: "Informe a nova senha" });
    }

    // 🔹 Valida token e tempo de expiração
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

    // 🔹 Atualiza senha e remove dados de recuperação
    user.senha = await bcrypt.hash(senha, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`✅ Senha redefinida com sucesso para o usuário ${user.email}`);
    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao redefinir senha:", err);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
};
