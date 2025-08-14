const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Rotas administrativas para gerenciamento completo do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PainelAdmin:
 *       type: object
 *       properties:
 *         agendamentos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               cliente:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 *               barbeiro:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 *               servico:
 *                 type: string
 *               data:
 *                 type: string
 *               horaInicio:
 *                 type: string
 *               horaFim:
 *                 type: string
 *               status:
 *                 type: string
 *         bloqueios:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               barbeiro:
 *                 type: string
 *               data:
 *                 type: string
 *               horaInicio:
 *                 type: string
 *               horaFim:
 *                 type: string
 *               motivo:
 *                 type: string
 *         servicos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               nome:
 *                 type: string
 *               duracao:
 *                 type: number
 *               preco:
 *                 type: number
 */

/**
 * @swagger
 * /admin/painel:
 *   get:
 *     summary: Obter dados completos do painel administrativo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do painel carregados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PainelAdmin'
 *       500:
 *         description: Erro ao carregar painel
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao carregar painel."
 */
router.get('/painel', autenticar, verificarPermissao(['ADMIN']), adminController.painelAdmin);

module.exports = router;
