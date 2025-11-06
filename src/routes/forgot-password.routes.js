const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/forgot-password.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: joao@email.com
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - senha
 *       properties:
 *         senha:
 *           type: string
 *           example: "novaSenha123"
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Email de recuperação enviado!"
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Recuperação de Senha]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/forgot-password", forgotPasswordController.forgotPassword);

/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Redefinir senha usando token
 *     tags: [Recuperação de Senha]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token recebido no email de recuperação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Token inválido ou expirado / senha não informada
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/reset-password/:token", forgotPasswordController.resetPassword);

module.exports = router;