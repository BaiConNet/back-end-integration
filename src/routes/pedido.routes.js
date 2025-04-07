const express = require('express');
const router = express.Router();
const { criarPedido, atualizarStatus } = require('../controllers/pedido.controller');
const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Rotas para criação e atualização de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cliente cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loja
 *               - itens
 *             properties:
 *               loja:
 *                 type: string
 *                 example: 6611972f160c2045c3eaa7d0
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - produto
 *                     - quantidade
 *                   properties:
 *                     produto:
 *                       type: string
 *                       example: 6611974b160c2045c3eaa7d3
 *                     quantidade:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido criado com sucesso
 *                 pedido:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno no servidor
 */

router.post('/', auth, verificarPermissao('CLIENTE'), criarPedido);

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
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
 *                 enum: [pendente, em andamento, concluído, cancelado]
 *                 example: em andamento
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar pedido
 */

router.patch('/:id/status', auth, verificarPermissao('DONO'), atualizarStatus);

module.exports = router;
