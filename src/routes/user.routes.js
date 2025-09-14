const express = require('express');
const router = express.Router();
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

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
 *           enum: [CLIENTE, DONO, ADMIN]
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
 */

router.post('/register', userController.register);

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
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */

router.post('/login', userController.login);

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
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */

router.get('/search', autenticar, verificarPermissao(['ADMIN']), userController.getUser);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Buscar usuário por ID ou email
 *     tags: [Usuários]
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

router.get('/me', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), userController.getMe);

router.get('/confirm-email', userController.confirmEmail);
module.exports = router;
