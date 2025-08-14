const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servico.controller');
const { autenticar, verificarPermissao } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do serviço
 *         nome:
 *           type: string
 *           description: Nome do serviço
 *         duracao:
 *           type: number
 *           description: Duração do serviço em minutos
 *         preco:
 *           type: number
 *           description: Preço do serviço
 *       example:
 *         _id: 64f0b4b0d1234567890abcde
 *         nome: Corte Masculino
 *         duracao: 30
 *         preco: 50.0
 * 
 *     ServicoRequest:
 *       type: object
 *       required:
 *         - nome
 *         - duracao
 *         - preco
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do serviço
 *         duracao:
 *           type: number
 *           description: Duração do serviço em minutos
 *         preco:
 *           type: number
 *           description: Preço do serviço
 *       example:
 *         nome: Corte Masculino
 *         duracao: 30
 *         preco: 50.0
 */

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Criar um novo serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoRequest'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       400:
 *         description: Serviço já existe
 *       500:
 *         description: Erro ao criar serviço
 */
router.post('/', autenticar, verificarPermissao(['ADMIN']), servicoController.criarServico);

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Listar todos os serviços
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Nenhum serviço encontrado
 *       500:
 *         description: Erro ao listar serviços
 */
router.get('/', autenticar, servicoController.listarServicos);

/**
 * @swagger
 * /servicos/{servicoId}:
 *   put:
 *     summary: Editar um serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoRequest'
 *     responses:
 *       200:
 *         description: Serviço editado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao editar serviço
 */
router.put('/:servicoId', autenticar, verificarPermissao(['ADMIN']), servicoController.editarServico);

/**
 * @swagger
 * /servicos/{servicoId}:
 *   delete:
 *     summary: Excluir um serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Serviço excluído com sucesso
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao excluir serviço
 */
router.delete('/:servicoId', autenticar, verificarPermissao(['ADMIN']), servicoController.excluirServico);

module.exports = router;
