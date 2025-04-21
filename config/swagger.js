const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Didas Backend API',
      version: '1.0.0',
      description: 'API documentation for Didas Backend Server',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the contact'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            message: {
              type: 'string',
              description: 'Contact message'
            },
            responded: {
              type: 'boolean',
              description: 'Whether the contact has been responded to',
              default: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the contact was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the contact was last updated'
            }
          }
        },
        Newsletter: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Subscriber email address'
            },
            name: {
              type: 'string',
              description: 'Subscriber name (optional)'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the subscription is active',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the subscription was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the subscription was last updated'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; 