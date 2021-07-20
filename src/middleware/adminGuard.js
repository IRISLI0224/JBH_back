const {
  AUTH_ERROR_INSUFFICIENT_PRIVILEGE,
} = require('../constants/errorMessage');

module.exports = (req, res, next) => {
  console.log(req.user);
  const { userType } = req.user;
  if (userType === true) {
    return next();
  }
  return res.status(401).json(AUTH_ERROR_INSUFFICIENT_PRIVILEGE);
};
