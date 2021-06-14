// @ts-ignore
const mongoose = require('mongoose');

//you can rewrite it 
const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
});

const model = mongoose.model('User', schema);

module.exports = model;