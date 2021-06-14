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

const morganLog =
  process.env.NODE_ENV === 'production' ? morgan('common') : morgan('dev');
app.use(morganLog);
app.use(cors());

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

module.exports = app;