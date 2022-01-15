const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Japanese Bath Room api',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/*.js'],
};

module.exports = swaggerJsDoc(options);
