const mongoose = require('mongoose');

exports.connectToDB = () => {
  const {
    DB_HOST, DB_PORT, DB_DATABASE, DB_NAME, DB_PASSWORD,
  } = process.env;
  let database = process.env.DB_DATABASE;
  let connectionString;
  if (process.env.NODE_ENV === 'test') {
    database += '_test';
  }
  if (DB_NAME && DB_PASSWORD) {
    // connectionString = `mongodb+srv://${DB_NAME}:${DB_PASSWORD}@${DB_HOST}/${database}`;
    connectionString = 'mongodb+srv://node:NgwVBhIFpZBRu28t@cluster0.bxc2i.mongodb.net/JBH?retryWrites=true&w=majority';
    console.log(connectionString);
  } else {
    connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${database}`;
    console.log(connectionString);
  }

  const db = mongoose.connection;
  db.on('connected', () => {
    console.log(`DB connected with ${connectionString}`);
  });
  db.on('error', (error) => {
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
