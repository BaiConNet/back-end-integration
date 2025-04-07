const express = require('express');
const router = express.Router();
const {
  criarProduto,
  listarProdutos,
  listarProdutosPorLoja,
  deletarProduto,
  atualizarProduto,
} = require('../controllers/produto.controller');

const auth = require('../middleware/auth.middleware');
const verificarPermissao = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nome:
 *           type: string
 *         preco:
 *           type: number
 *         descricao:
 *           type: string
 *         tipo:
 *           type: string
 *         dono:
 *           type: string
 *         loja:
 *           type: string
 *       example:
 *         _id: 643aa5c7d76c1d001e1d4b3b
 *         nome: Pizza Calabresa
 *         preco: 39.90
 *         descricao: Pizza com calabresa e cebola
 *         tipo: Pizzaria
 *         dono: 643aa3d5d76c1d001e1d4b3a
 *         loja: 643aa4fbd76c1d001e1d4b3c
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
router.get('/', listarProdutos);

/**
 * @swagger
 * /produtos/loja/{lojaId}:
 *   get:
 *     summary: Lista produtos de uma loja específica
 *     tags: 
 *        - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lojaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Loja não encontrada
 *       403:
 *         description: Nenhum produto encontrado para a loja
 *       500:
 *         description: Erro ao buscar produtos
 */
router.get('/loja/:lojaId', listarProdutosPorLoja);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto vinculado à loja do usuário autenticado
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - descricao
 *               - categoria
 *               - imagem
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Pizza Calabresa
 *               preco:
 *                 type: number
 *                 example: 39.99
 *               descricao:
 *                 type: string
 *                 example: Deliciosa pizza com queijo e calabresa
 *               categoria:
 *                 type: string
 *                 example: Pizzaria
 *               imagem:
 *                 type: string
 *                 example: https://exemplo.com/pizza.png
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       403:
 *         description: Usuário não possui loja cadastrada
 *       500:
 *         description: Erro ao criar o produto
 */

router.post('/', auth, verificarPermissao('DONO'), criarProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', auth, verificarPermissao('DONO'), deletarProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', auth, verificarPermissao('DONO'), atualizarProduto);

module.exports = router;
