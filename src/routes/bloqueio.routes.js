const express = require('express');
const router = express.Router();
const bloqueioController = require('../controllers/bloqueio.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Bloqueios
 *   description: Rotas para gerenciamento de bloqueios de agenda de barbeiros
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bloqueio:
 *       type: object
 *       required:
 *         - barbeiro
 *         - data
 *         - horaInicio
 *         - horaFim
 *         - motivo
 *       properties:
 *         barbeiro:
 *           type: string
 *           description: ID do barbeiro
 *         data:
 *           type: string
 *           format: date
 *           description: Data do bloqueio
 *         horaInicio:
 *           type: string
 *           description: Hora de início do bloqueio (HH:mm)
 *         horaFim:
 *           type: string
 *           description: Hora de fim do bloqueio (HH:mm)
 *         motivo:
 *           type: string
 *           description: Motivo do bloqueio
 *       example:
 *         barbeiro: "64b7e98b12a4f8a0f0d1c123"
 *         data: "2025-08-15"
 *         horaInicio: "09:00"
 *         horaFim: "12:00"
 *         motivo: "Treinamento interno"
 */

/**
 * @swagger
 * /bloqueio:
 *   post:
 *     summary: Criar um bloqueio de agenda para um barbeiro
 *     tags: [Bloqueios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloqueio'
 *     responses:
 *       201:
 *         description: Bloqueio criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Bloqueio criado com sucesso!"
 *               novoBloqueio:
 *                 barbeiro: "64b7e98b12a4f8a0f0d1c123"
 *                 data: "2025-08-15"
 *                 horaInicio: "09:00"
 *                 horaFim: "12:00"
 *                 motivo: "Treinamento interno"
 *       400:
 *         description: Horário já bloqueado
 *         content:
 *           application/json:
 *             example:
 *               message: "Este horário já está bloqueado."
 *       404:
 *         description: Barbeiro não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Barbeiro não encontrado."
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), bloqueioController.criarBloqueio);

/**
 * @swagger
 * /bloqueio/{barbeiroId}:
 *   get:
 *     summary: Listar bloqueios de um barbeiro
 *     tags: [Bloqueios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barbeiroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do barbeiro
 *     responses:
 *       200:
 *         description: Lista de bloqueios encontrados
 *         content:
 *           application/json:
 *             example:
 *               - barbeiro: "64b7e98b12a4f8a0f0d1c123"
 *                 data: "2025-08-15"
 *                 horaInicio: "09:00"
 *                 horaFim: "12:00"
 *                 motivo: "Treinamento interno"
 *       404:
 *         description: Nenhum bloqueio encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Nenhum bloqueio encontrado."
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:barbeiroId', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), bloqueioController.listarBloqueios);

router.delete('/:bloqueioId', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), bloqueioController.excluirBloqueio);

module.exports = router;
