const Joi = require('joi');

const stringValidator = Joi.string().min(2).max(20).required();
const mailValidator = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  })
  .required();
const phoneValidator = Joi.string()
  .pattern(new RegExp('^[0-9]{8,10}$'))
  .required();

const bookingValidatorSchema = Joi.object({
  firstName: stringValidator,
  lastName: stringValidator,
  gender: Joi.boolean().required(),
  email: mailValidator,
  phone: phoneValidator,
  bookingDate: Joi.date().iso().raw().required(),
  numOfGuests: Joi.number().integer().min(1).max(20)
    .required(),
  dateOfBirth: Joi.date().iso().raw().required(),
  paidAmount: Joi.number().integer().min(10).required(),
});

module.exports = async (req, res, next) => {
  req.validatedBooking = await bookingValidatorSchema.validateAsync(req.body, {
    allowUnknown: true,
    abortEarly: false,
  });

  return next();
};
