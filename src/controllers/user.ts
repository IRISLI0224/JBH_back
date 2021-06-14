const User = require('../models/user');

//@ts-ignore
async function addUser(req:any, res:any) {
    const {
        firstName,
        lastName,
    } = req.body;
    const user = new User({ firstName, lastName });
    await user.save();
    return res.json({ firstName, lastName });
}

module.exports = { addUser };