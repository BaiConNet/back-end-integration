const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Bairro',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de comércio local',
    },
    servers: [
      {
        url: 'https://api-bairro.onrender.com',
      },
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6611974b160c2045c3eaa7d3' },
            nome: { type: 'string', example: 'Pizza Calabresa' },
            preco: { type: 'number', example: 39.99 },
            descricao: { type: 'string', example: 'Deliciosa pizza com queijo e calabresa' },
            categoria: { type: 'string', example: 'Pizzaria' },
            imagem: { type: 'string', example: 'https://exemplo.com/pizza.png' },
            dono: { type: 'string', example: '6611971a160c2045c3eaa7c9' }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6611a8938e1f8e4e62f4dc21' },
            cliente: {
              type: 'string',
              example: '6611971a160c2045c3eaa7c9',
              description: 'ID do cliente que fez o pedido'
            },
            loja: {
              type: 'string',
              example: '6611972f160c2045c3eaa7d0',
              description: 'ID da loja onde o pedido foi feito'
            },
            itens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  produto: {
                    type: 'string',
                    example: '6611974b160c2045c3eaa7d3'
                  },
                  quantidade: {
                    type: 'number',
                    example: 2
                  }
                }
              }
            },
            total: {
              type: 'number',
              example: 79.98,
              description: 'Valor total calculado do pedido'
            },
            status: {
              type: 'string',
              enum: ['AGUARDANDO', 'CONFIRMADO', 'PREPARANDO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO'],
              example: 'AGUARDANDO'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              example: '2024-04-06T15:35:21.173Z'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
