const User = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // gerar token único
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // enviar email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Recuperação de Senha - Barber Admin",
      html: `
        <p>Você solicitou a recuperação da senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>Este link expira em 1 hora.</p>
      `,
    });

    res.json({ message: "Email de recuperação enviado!" });
  } catch (err) {
    console.error("Erro ao enviar email de recuperação:", err);
    res.status(500).json({ message: "Erro ao enviar email" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).json({ message: "Informe a nova senha" });
    }
    
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // salva a nova senha
    user.senha = await bcrypt.hash(senha, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
};
