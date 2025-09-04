const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamento.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Rotas para gerenciamento de agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do agendamento
 *         cliente:
 *           type: string
 *           description: ID do cliente (User)
 *         barbeiro:
 *           type: string
 *           description: ID do barbeiro (User)
 *         servico:
 *           type: string
 *           description: ID do serviço
 *         data:
 *           type: string
 *           format: date
 *           description: Data do agendamento
 *         horaInicio:
 *           type: string
 *           description: Hora de início (HH:mm)
 *         horaFim:
 *           type: string
 *           description: Hora de fim (HH:mm)
 *         status:
 *           type: string
 *           enum: [AGENDADO, CANCELADO, CONCLUIDO]
 *           description: Status do agendamento
 *       example:
 *         _id: "64b8f99c12a4f8a0f0d1d456"
 *         cliente: "64b7e98b12a4f8a0f0d1c123"
 *         barbeiro: "64b7e98b12a4f8a0f0d1c999"
 *         servico: "64f0b4b0d1234567890abcde"
 *         data: "2025-08-15"
 *         horaInicio: "14:00"
 *         horaFim: "14:30"
 *         status: "AGENDADO"
 *
 *     AgendamentoRequest:
 *       type: object
 *       required:
 *         - cliente
 *         - barbeiro
 *         - servico
 *         - data
 *         - horaInicio
 *         - horaFim
 *       properties:
 *         cliente:
 *           type: string
 *           description: ID do cliente
 *         barbeiro:
 *           type: string
 *           description: ID do barbeiro
 *         servico:
 *           type: string
 *           description: ID do serviço
 *         data:
 *           type: string
 *           format: date
 *           description: Data do agendamento
 *         horaInicio:
 *           type: string
 *           description: Hora de início (HH:mm)
 *         horaFim:
 *           type: string
 *           description: Hora de fim (HH:mm)
 *       example:
 *         cliente: "64b7e98b12a4f8a0f0d1c123"
 *         barbeiro: "64b7e98b12a4f8a0f0d1c999"
 *         servico: "64f0b4b0d1234567890abcde"
 *         data: "2025-08-15"
 *         horaInicio: "14:00"
 *         horaFim: "14:30"
 */

/**
 * @swagger
 * /agendamento:
 *   post:
 *     summary: Criar um novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoRequest'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Agendamento criado com sucesso!"
 *               novoAgendamento:
 *                 cliente: "64b7e98b12a4f8a0f0d1c123"
 *                 barbeiro: "64b7e98b12a4f8a0f0d1c999"
 *                 servico: "64f0b4b0d1234567890abcde"
 *                 data: "2025-08-15"
 *                 horaInicio: "14:00"
 *                 horaFim: "14:30"
 *                 status: "AGENDADO"
 *       400:
 *         description: Conflito de horário ou duração inválida
 *         content:
 *           application/json:
 *             example:
 *               message: "O barbeiro já tem um agendamento nesse horário."
 *       404:
 *         description: Serviço não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Serviço não encontrado."
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', autenticar, agendamentoController.criarAgendamento);

/**
 * @swagger
 * /agendamento/{agendamentoId}/cancelar:
 *   put:
 *     summary: Cancelar um agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Agendamento cancelado com sucesso."
 *       400:
 *         description: Cancelamento fora do prazo (menos de 2 horas antes)
 *         content:
 *           application/json:
 *             example:
 *               message: "Cancelamento deve ser feito com no mínimo 2 horas de antecedência."
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Agendamento não encontrado."
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:agendamentoId/cancelar', autenticar, agendamentoController.cancelarAgendamento);

/**
 * @swagger
 * /agendamento/{id}/status:
 *   patch:
 *     summary: Atualizar status de um agendamento (manual)
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AGENDADO, CANCELADO, CONCLUIDO]
 *                 description: Novo status do agendamento
 *             example:
 *               status: CONCLUIDO
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Status atualizado para CONCLUIDO"
 *               agendamento:
 *                 _id: "68a2040b354291ebd36ca458"
 *                 cliente: "689e2944f3fdcc63219e17d9"
 *                 barbeiro: "689e2931f3fdcc63219e17d6"
 *                 servico: "68a203f91f6ab36da5bac471"
 *                 horario: "68a1fd421f6ab36da5bac459"
 *                 status: "CONCLUIDO"
 *                 criadoEm: "2025-08-17T16:32:11.640Z"
 *                 __v: 0
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             example:
 *               message: "Status inválido."
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Agendamento não encontrado."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao atualizar status."
 */
router.patch('/:id/status', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), agendamentoController.atualizarStatus);

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                   barbeiro:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                   servico:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       preco:
 *                         type: number
 *                       duracao:
 *                         type: number
 *                   horario:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       data:
 *                         type: string
 *                       horaInicio:
 *                         type: string
 *                       horaFim:
 *                         type: string
 *                       isDisponivel:
 *                         type: boolean
 *                   status:
 *                     type: string
 *                     enum: [AGENDADO, CANCELADO, CONCLUIDO]
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro ao buscar agendamentos.
 */
router.get('/', autenticar, verificarPermissao(['BARBEIRO', 'ADMIN']), agendamentoController.listarAgendamentos);
router.get('/:id', autenticar,verificarPermissao(['BARBEIRO', 'ADMIN']), agendamentoController.buscarAgendamentoPorId);

module.exports = router;
