const Session = require("../models/session");

// @ts-ignore
async function addSession(req: any, res: any) {
  const { date, time, maxNumber } = req.body;
  //check wether session exist
  const existSession = await findSession({ date, time });
  if (existSession) {
    return res.status(400).send("session existing");
  }
  const session = new Session({ time, date, maxNumber });
  await session.save();
  return res.status(201).json(session);
}

// @ts-ignore
async function getSession(req: any, res: any) {
  const { date, time } = req.params;
  const session = await findSession({ date, time });
  if (!session) {
    return res.status(404).send("session is not found");
  }
  return res.json(session);
}

// @ts-ignore
async function updateSession(req: any, res: any) {
  const { date, time } = req.params;
  const { maxNumber } = req.body;
  const session = await Session.findOneAndUpdate(
    { date, time },
    { $set: { maxNumber } },
    { new: true }
  );
  if (!session) {
    return res.status(404).send("session is not found");
  }
  return res.send("update successful");
}

// @ts-ignore
async function deleteSession(req: any, res: any) {
  const { date, time } = req.params;
  const session = await findSession({ date, time });
  if (!session) {
    return res.status(404).json("session is not found");
  }
  await Session.findByIdAndDelete(session.id).exec();
  return res.status(200).send("session has been deleted");
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
