/* eslint-disable no-console */

// @ts-ignore
const mongoose = require('mongoose');

exports.connectToDB = () => {
  let database = process.env.DB_NAME;
  if (process.env.NODE_ENV === 'test') {
    database += '_test';
  }
  // @ts-ignore
  const connectionString = process.env.CONNECTION_STRING + database;
  const db = mongoose.connection;
  db.on('connected', () => {
    console.log(`DB connected with ${connectionString}`);
  });
  db.on('error', (error: any) => {
    console.log('DB connection failed');
    console.log(error.message);
    process.exit(1);
  });
  db.on('disconnected', () => {
    console.log('disconnected');
  });

  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

exports.disconnectDB = async () => mongoose.disconnect();
