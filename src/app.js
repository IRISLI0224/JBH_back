require('dotenv').config();
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const swaggerJsDoc = require('./utils/swagger');

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(morgan(process.env.NODE_DEV === 'production' ? 'common' : 'dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));
app.use('/api', router);
app.use(errorHandler);

module.exports = app;
