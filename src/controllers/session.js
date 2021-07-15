const Joi = require('joi');
const Session = require('../models/session');

//= =================== HELPER FUNCTION ====================
function findSession(referenceInfo) {
  return Session.findOne(referenceInfo).exec();
}

function getFormattedSession({ date, time, maxNumber, state }) {
  return {
    date,
    time,
    maxNumber,
    state,
  };
}

function getFormattedMonth(month) {
  const length = month.toString().length;
  return length === 1 ? `0${month}` : month;
}

//= =================== ADD SESSION ====================
async function addSession(req, res) {
  // validate session data
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

  // check whether session exist
  const existSession = await findSession({ date, time });
  if (existSession) {
    return res.status(409).send('Session already existed');
  }

  // create new session
  const session = new Session({ time, date, maxNumber });
  await session.save();

  return res.status(201).json(session);
}

//= =================== GET SESSION ====================
async function getSession(req, res) {
  // validate session data
  const schema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
  });
  const { date, time } = await schema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  // check whether session exist
  const session = await findSession({ date, time });
  if (!session) {
    return res.status(404).send('Session is not found');
  }

  return res.json(getFormattedSession(session));
}

//= =================== GET SESSION BY MONTH ====================
async function getSessionByMonth(req, res) {
  // validate input data
  const monthSchema = Joi.object({
    year: Joi.number().required(),
    month: Joi.number().required(),
  });
  const { year, month } = await monthSchema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  const formattedMonth = getFormattedMonth(month);

  const reg = new RegExp(`^${year}-${formattedMonth}`);
  const requestingSessions = await Session.find({
    date: { $regex: reg },
  }).exec();
  const formattedSessionArr = requestingSessions.map((session) =>
    getFormattedSession(session)
  );

  const daysInMonth = new Date(year, month, 0).getDate();
  const stateArr = [];
  for (let i = 0; i < daysInMonth; i += 1) {
    stateArr.push("closed");
    for (let j = 0; j < formattedSessionArr.length; j += 1) {
      const requestingDay = parseInt(
        formattedSessionArr[j].date.split("-")[2],
        10
      );
      if (requestingDay === i + 1) {
        stateArr[i] = formattedSessionArr[j].state;
        break;
      }
    }
  }
  return res.json({ date: `${year}-${formattedMonth}`, stateArr });
}

//= =================== UPDATE SESSION ====================
async function updateSession(req, res) {
  // validate session data
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

  // update session
  const session = await Session.findOneAndUpdate(
    { date, time },
    { $set: { maxNumber } },
    { new: true }
  );

  // check whether session exist
  if (!session) {
    return res.status(404).send('Session is not found');
  }

  return res.send('Update successful');
}

//= =================== DELETE SESSION ====================
async function deleteSession(req, res) {
  // validate session data
  const schema = Joi.object({
    date: Joi.date().iso().raw().required(),
    time: Joi.number().required(),
  });
  const { date, time } = await schema.validateAsync(req.params, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
  });

  //delete the session
  const session = await Session.findOneAndDelete({ date, time });

  //check whether the session exist
  if (!session) {
    return res.status(404).send('Session is not found');
  }

  return res.sendStatus(204);
}

module.exports = {
  addSession,
  getSession,
  getSessionByMonth,
  updateSession,
  deleteSession,
};
