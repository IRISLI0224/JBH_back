const User = require('../models/user');

async function addUser(req, res) {
    const {
        firstName,
        lastName,
    } = req.body;
    const user = new User({ firstName, lastName });
    await user.save();
    return res.json({ firstName, lastName });
}

module.exports = { addUser };