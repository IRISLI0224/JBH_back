const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

// you can rewrite it
// @ts-ignore
// test middleware purpose
async function addUser(req:any, res:any) {
    const {
        firstName,
        lastName,
        email,
        DOB,
        userType,
    } = req.body;
    const user = new User({
        firstName,
        lastName,
        email,
        DOB,
        userType,
    })
    await user.hashPassword();
    await user.save();
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    const token = generateToken(user._id, user.userType)
    return res.json({ email, token });
}

module.exports = { addUser };
