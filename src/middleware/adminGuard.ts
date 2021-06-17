import { AUTH_ERROR_INSUFFICIENT_PRIVILEGE } from "../constants/errorMessage";

module.exports = (req:any, res:any, next:any) => {
    console.log(req);
    const user = req.body;
    const userType = user.userType;
    if (userType === "admin") {
        return next();
    }
    return res.status(401).json(AUTH_ERROR_INSUFFICIENT_PRIVILEGE);
}