import {
  AUTH_ERROR_NO_AUTHHEAD,
  AUTH_ERROR_WRONG_AUTHHEAD_FORMAT,
  AUTH_ERROR_NO_PRIVILEGE,
} from '../constants/errorMessage';

const { validateToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json(AUTH_ERROR_NO_AUTHHEAD);
  }
  const contentArr = authHeader.split(' ');
  if (contentArr.length !== 2 || contentArr[0] !== 'Bearer') {
    return res.status(401).json(AUTH_ERROR_WRONG_AUTHHEAD_FORMAT);
  }
  const decoded = validateToken(contentArr[1]);
  if (decoded) {
    req.user = decoded;
    return next();
  }
  return res.status(401).json(AUTH_ERROR_NO_PRIVILEGE);
};
