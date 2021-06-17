// @ts-ignore
import { JWT_KEY } from "../constants/env";

const jwt = require('jsonwebtoken');

function generateToken(id:any, userType:string) {
    const token = jwt.sign({ id, userType }, JWT_KEY, {
        expiresIn: "1h",
    });
    return token;
}

function validateToken(token:string) {
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_KEY);
    } catch (e) {
        return null;
    }
    return decoded;
}

module.exports = {
    generateToken,
    validateToken,
};