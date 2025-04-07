const express = require('express');
const router = express.Router();
const { pegarClientes } = require('../controllers/cliente.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Endpoints acessíveis apenas por clientes autenticados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do cliente
 *         nome:
 *           type: string
 *           description: Nome do cliente
 *         email:
 *           type: string
 *           description: E-mail do cliente
 *       example:
 *         _id: 643a928ef95c1d3f21907c2d
 *         nome: João da Silva
 *         email: joao@email.com
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Retorna os dados do cliente autenticado
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do cliente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token JWT inválido ou não enviado
 *       403:
 *         description: Acesso negado - apenas CLIENTE pode acessar
 */
router.get('/', auth, verificarPermissao('CLIENTE'), pegarClientes);

module.exports = router;
