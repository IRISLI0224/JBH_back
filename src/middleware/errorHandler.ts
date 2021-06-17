// eslint-disable-next-line no-unused-vars
module.exports = (err:any, req:any, res:any, next:any) => {
  if (err.name === 'ValidationError') {
    if (process.env.NODE_ENV === 'production') {
      const { details } = err;
      const errMsgs = details.map((i: { message: string; }) => ({ message: i.message }));
      return res.status(400).json(errMsgs);
    }
    return res.status(400).json(err);
  }
  return res.status(500).json('something unexpected happened');
};
