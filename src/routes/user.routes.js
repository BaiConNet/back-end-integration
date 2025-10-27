const express = require("express");
const router = express.Router();
const {
  autenticar,
  verificarPermissao,
} = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRequest:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - telefone
 *         - senha
 *         - role
 *       properties:
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           example: joao@gmail.com
 *         telefone:
 *           type: string
 *           example: "11999999999"
 *         senha:
 *           type: string
 *           example: "123456"
 *         role:
 *           type: string
 *           enum: [CLIENTE, BARBEIRO, ADMIN]
 *           example: CLIENTE
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f0a3bc23b9c7001a5d6a9f
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           example: joao@email.com
 *         telefone:
 *           type: string
 *           example: "11999999999"
 *         role:
 *           type: string
 *           example: CLIENTE
 *         emailConfirmed:
 *           type: boolean
 *           example: true
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           example: 2025-08-13T18:20:00.000Z
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           example: joao@email.com
 *         senha:
 *           type: string
 *           example: "123456"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cadastro realizado! Verifique seu email para confirmar.
 *       400:
 *         description: Erro de validação ou email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email ou senha inválidos
 *       403:
 *         description: Email não confirmado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Buscar usuário por ID ou email
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Nenhum parâmetro informado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 */
router.get(
  "/search",
  autenticar,
  verificarPermissao(["ADMIN"]),
  userController.getUser
);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Retorna perfil do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.get(
  "/me",
  autenticar,
  verificarPermissao(["BARBEIRO", "ADMIN"]),
  userController.getMe
);

/**
 * @swagger
 * /user/confirm-email:
 *   get:
 *     summary: Confirmar email do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de confirmação enviado por email
 *     responses:
 *       200:
 *         description: Email confirmado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email confirmado com sucesso!
 *       400:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/confirm-email", userController.confirmEmail);

module.exports = router;
