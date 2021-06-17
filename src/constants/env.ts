export const JWT_KEY =
process.env.NODE_ENV === "production" ? process.env.JWT_KEY : "secret";
