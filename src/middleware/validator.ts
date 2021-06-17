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

const validatorSchema = Joi.object({
  firstName: stringValidator,
  lastName: stringValidator,
  gender: Joi.required(),
  email: mailValidator,
  birthYear: yearValidator,
  phone: phoneValidator,
});

module.exports = async (req: { validatedBody: any; body: any; }, res: any, next: () => void) => {
  req.validatedBody = await validatorSchema.validateAsync(req.body, {
    allowUnknown: true,
    abortEarly: false,
  });
  next();
};
