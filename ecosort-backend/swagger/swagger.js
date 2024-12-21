const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation EcoSort',
      version: '1.0.0',
      description: 'Документация для EcoSort by DimaDD',
    },
    servers: [
      {
        url: 'http://localhost:8082',
      },
      {
        url: 'https://localhost:8443',
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