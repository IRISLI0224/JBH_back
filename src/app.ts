require('dotenv').config();
// @ts-ignore
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');

// @ts-ignore
const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');
// @ts-ignore
const app = express();

app.use(morgan(process.env.NODE_DEV === 'production' ? 'common' : 'dev'));
app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use(errorHandler);

module.exports = app;
