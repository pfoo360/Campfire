/*
    In production, make sure to add the flag "secure: true"
    Makes it so it only serves on https
*/
const MAX_AGE = 10 * 60 * 60 * 1000;

const JWT_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: MAX_AGE,
};

module.exports = { JWT_CONFIG };
