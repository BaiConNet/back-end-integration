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
 *             $ref: '#/components/schemas/Agendamento'
 *         bloqueios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Bloqueio'
 *         servicos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Servico'
 *         horarios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *         clientes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         barbeiros:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /admin/painel:
 *   get:
 *     summary: Painel geral do admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Painel carregado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PainelAdmin'
 *       500:
 *         description: Erro ao carregar painel
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao carregar painel admin."
 */
router.get('/painel', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), adminController.painelAdmin);

module.exports = router;