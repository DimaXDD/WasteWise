const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WasteWise API Documentation',
      version: '1.0.0',
      description: `Документация для WasteWise. Этот API предоставляет возможности для работы с функционалом 
      системы переработки отходов.`,
      contact: {
        name: 'DimaDD',
        url: 'https://github.com/DimaXDD',
        email: 'trubachdmitry@gmail.com',
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:8082',
        description: 'Local development server (HTTP)',
      },
      {
        url: 'https://localhost:8443',
        description: 'Local secure development server (HTTPS)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
