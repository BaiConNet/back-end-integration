const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Rotas para gerenciamento de horários disponíveis dos barbeiros
 */

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Criar um novo horário disponível
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - horaInicio
 *               - horaFim
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horaInicio:
 *                 type: string
 *               horaFim:
 *                 type: string
 *             example:
 *               data: "2025-08-15"
 *               horaInicio: "14:00"
 *               horaFim: "14:30"
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *       400:
 *         description: Conflito de horário ou horário inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), scheduleController.criarHorario);

/**
 * @swagger
 * /schedule/barbeiro/{barbeiroId}:
 *   get:
 *     summary: Listar horários disponíveis de um barbeiro
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: barbeiroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do barbeiro
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/barbeiro/:barbeiroId', autenticar, scheduleController.listarHorarios);

/**
 * @swagger
 * /schedule/{horarioId}:
 *   put:
 *     summary: Editar um horário (somente dono ou admin)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horaInicio:
 *                 type: string
 *               horaFim:
 *                 type: string
 *               isDisponivel:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Horário editado com sucesso
 *       400:
 *         description: Horário inválido
 *       403:
 *         description: Ação não permitida
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:horarioId', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), scheduleController.editarHorario);

/**
 * @swagger
 * /schedule/{horarioId}:
 *   delete:
 *     summary: Excluir um horário (somente dono ou admin)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horário excluído com sucesso
 *       403:
 *         description: Ação não permitida
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:horarioId', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), scheduleController.excluirHorario);

module.exports = router;
