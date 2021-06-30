const JWT_KEY = process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : 'secret';

module.exports = JWT_KEY;
