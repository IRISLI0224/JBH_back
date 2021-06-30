import { AUTH_ERROR_INSUFFICIENT_PRIVILEGE } from '../constants/errorMessage';

module.exports = (req, res, next) => {
  console.log(req);
  const user = req.body;
  const { userType } = user;
  if (userType === 'admin') {
    return next();
  }
  return res.status(401).json(AUTH_ERROR_INSUFFICIENT_PRIVILEGE);
};
