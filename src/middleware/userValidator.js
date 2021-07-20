const Joi = require('joi');

const stringValidator = Joi.string().min(2).max(20).required();
const yearValidator = Joi.number().integer().min(1900).max(2020);
const mailValidator = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  })
  .required();
const phoneValidator = Joi.string()
  .pattern(new RegExp('^[0-9]{8,10}$'))
  .required();

const clientValidatorSchema = Joi.object({
  firstName: stringValidator,
  lastName: stringValidator,
  gender: Joi.required(),
  email: mailValidator,
  birthYear: yearValidator,
  phone: phoneValidator,
});

const adminValidatorSchema = Joi.object({
  firstName: stringValidator,
  email: mailValidator,
  // admin必须传userType值且必须为1，加gender：null是为了防止client用户验证时加了userType为1的字段混进来
  // 这样client就必须不加userType字段从而使用数据库默认的2
  gender: null,
  userType: 1,
});

module.exports = async (req, res, next) => {
  const { userType } = req.body;
  // add client user时不传userType值，model里会使用默认值2
  if (!userType) {
    req.validatedClient = await clientValidatorSchema.validateAsync(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
  } else {
    req.validatedAdmin = await adminValidatorSchema.validateAsync(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
  }
  return next();
};
