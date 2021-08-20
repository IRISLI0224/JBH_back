const Joi = require("joi");
const Session = require("../models/session");

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
  const { length } = month.toString();
  return length === 1 ? `0${month}` : month;
}

function buildStateArr(daysInMonth, SessionArr) {
  const stateArr = [];
  for (let i = 0; i < daysInMonth; i += 1) {
    stateArr.push("closed");
    for (let j = 0; j < SessionArr.length; j += 1) {
      const requestingDay = parseInt(SessionArr[j].date.split("-")[2], 10);
      if (requestingDay === i + 1) {
        stateArr[i] = SessionArr[j].state;
        break;
      }
    }
  }
  return stateArr;
}

/**
 * @swagger
 * /api/sessions:
 *   post:
 *    summary: Create a new session
 *    tags: [Sessions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - date
 *              - time
 *              - maxNumber
 *            properties:
 *              date:
 *                type: string
 *                description: the date of the session
 *              time:
 *                type: integer
 *                description: the time of the session
 *              maxNumber:
 *                type: integer
 *                description: the max number of people that is to be served
 *            example:
 *              date: 2021-08-21
 *              time: 0
 *              maxNumber: 30
 *    responses:
 *      201:
 *        description: The session successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: auto generated unique identifier
 *                date:
 *                  type: string
 *                  description: the date of the session
 *                time:
 *                  type: integer
 *                  description: the time of the session
 *                maxNumber:
 *                  type: integer
 *                  description: the max number of people that is to be served
 *                bookings:
 *                  type: array
 *                  description: the existing number of clients booked for the session
 *                  items:
 *                    type: integer
 *                state:
 *                  type: string
 *                  description: the availability of the session
 *                createdAt:
 *                  type: string
 *                  description: the time when session was created
 *                updatedAt:
 *                  type: string
 *                  description: the time when session was updated
 *              example:
 *                time: 0
 *                bookings: []
 *                _id: 611f18d75a316237bc318d8a
 *                date: 2021-08-20
 *                maxNumber: 30
 *                createdAt: 2021-08-20T02:52:07.492Z
 *                updatedAt: 2021-08-20T02:52:07.492Z
 *                state: available
 *      409:
 *        description: Session already existed
 */

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
    return res.status(409).send("Session already existed");
  }

  // create new session
  const session = new Session({ time, date, maxNumber });
  await session.save();

  return res.status(201).json(session);
}

/**
 * @swagger
 * /api/sessions/single/{date}/{time}:
 *   get:
 *    summary: Get a session by date and time
 *    tags: [Sessions]
 *    parameters:
 *      - name: date
 *        in: path
 *        description: the date of session
 *        required: true
 *        schema:
 *          type: string
 *      - name: time
 *        in: path
 *        description: the time of session
 *        schema:
 *          type: integar
 *    responses:
 *      200:
 *        description: The session by date and time
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                date:
 *                  type: string
 *                  description: the date of the session
 *                time:
 *                  type: integer
 *                  description: the time of the session
 *                maxNumber:
 *                  type: integer
 *                  description: the max number of people that is to be served
 *                state:
 *                  type: string
 *                  description: the availability of the session
 *              example:
 *                date: 2021-08-20
 *                time: 0
 *                maxNumber: 30
 *                state: available
 *      404:
 *        description: Session is not found
 */

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
    return res.status(404).send("Session is not found");
  }

  return res.json(getFormattedSession(session));
}

/**
 * @swagger
 * /api/sessions/group/{year}/{month}:
 *   get:
 *    summary: Get sessions by month
 *    tags: [Sessions]
 *    parameters:
 *      - name: year
 *        in: path
 *        description: the year of session
 *        required: true
 *        schema:
 *          type: string
 *      - name: month
 *        in: path
 *        description: the month of session
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The sessions by month
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                date:
 *                  type: string
 *                  description: the date of the session
 *                stateArr:
 *                  type: array
 *                  description: the session states for the selected month
 *                  items:
 *                    type: string
 *              example:
 *                date: 2021-08
 *                stateArr: [
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  available,
 *                  closed,
 *                  available,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  limited,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  fullyBooked,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                  closed,
 *                ]
 */

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
  const stateArr = buildStateArr(daysInMonth, formattedSessionArr);

  return res.json({ date: `${year}-${formattedMonth}`, stateArr });
}

/**
 * @swagger
 * /api/sessions/{date}/{time}:
 *   put:
 *    summary: Updata a session by date and time
 *    tags: [Sessions]
 *    parameters:
 *      - name: date
 *        in: path
 *        description: the date of session
 *        required: true
 *        schema:
 *          type: string
 *      - name: time
 *        in: path
 *        description: the time of session
 *        schema:
 *          type: integar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - maxNumber
 *            properties:
 *              maxNumber:
 *                type: integer
 *                description: the max number of people that is to be served
 *            example:
 *              maxNumber: 30
 *    responses:
 *      200:
 *        description: Update successful
 *      404:
 *        description: Session is not found
 */

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
    return res.status(404).send("Session is not found");
  }

  return res.send("Update successful");
}

/**
 * @swagger
 * /api/sessions/{date}/{time}:
 *   delete:
 *    summary: Delete a session by date and time
 *    tags: [Sessions]
 *    parameters:
 *      - name: date
 *        in: path
 *        description: the date of session
 *        required: true
 *        schema:
 *          type: string
 *      - name: time
 *        in: path
 *        description: the time of session
 *        schema:
 *          type: integar
 *    responses:
 *      204:
 *        description: Delete successful
 *      404:
 *        description: Session is not found
 */

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

  // delete the session
  const session = await Session.findOneAndDelete({ date, time });

  // check whether the session exist
  if (!session) {
    return res.status(404).send("Session is not found");
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
