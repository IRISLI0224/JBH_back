const jwt = require('jsonwebtoken');
const JWT_KEY = require('../constants/env');

function generateToken(id, userType) {
  const token = jwt.sign({ id, userType }, JWT_KEY, {
    expiresIn: '2h',
  });
  return token;
}

function validateToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_KEY);
  } catch (e) {
    return null;
  }
  return decoded;
}

module.exports = {
  generateToken,
  validateToken,
};
