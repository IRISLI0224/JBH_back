// @ts-ignore
const Session = require("../models/session");
// @ts-ignore
const Joi = require("joi");

// @ts-ignore
async function addSession(req: any, res: any) {
  //validate session data
  const schema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
    maxNumber: Joi.number().required(),
  });
  const { date, time, maxNumber } = await schema.validateAsync(req.body, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  //check wether session exist
  const existSession = await findSession({ date, time });
  if (existSession) {
    return res.status(409).send("session existing");
  }

  //create new session
  const session = new Session({ time, date, maxNumber });
  await session.save();

  return res.status(201).json(session);
}

// @ts-ignore
async function getSession(req: any, res: any) {
  //validate session data
  const schema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
  });
  const { date, time } = await schema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  //check wether session exist
  const session = await findSession({ date, time });
  if (!session) {
    return res.status(404).send("session is not found");
  }

  return res.json(session);
}

// @ts-ignore
async function updateSession(req: any, res: any) {
  //validate session data
  const dateAndTimeSchema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
  });
  const { date, time } = await dateAndTimeSchema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });
  const maxNumberSchema = Joi.object({
    maxNumber: Joi.number().required(),
  });
  const { maxNumber } = await maxNumberSchema.validateAsync(req.body, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  //update session
  const session = await Session.findOneAndUpdate(
    { date, time },
    { $set: { maxNumber } },
    { new: true }
  );

  //check wether session exist
  if (!session) {
    return res.status(404).send("session is not found");
  }

  return res.send("update successful");
}

// @ts-ignore
async function deleteSession(req: any, res: any) {
  //validate session data
  const schema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
  });
  const { date, time } = await schema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  //check wether session exist
  const session = await findSession({ date, time });
  if (!session) {
    return res.status(404).send("session is not found");
  }

  //delete session
  await Session.findByIdAndDelete(session.id).exec();
  return res.status(204).send("session has been deleted");
}

//helper function
function findSession(referenceInfo: { date: string; time: number }) {
  return Session.findOne(referenceInfo).exec();
}

module.exports = {
  addSession,
  getSession,
  updateSession,
  deleteSession,
};
