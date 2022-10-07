const path = require("path");
const { logEvents } = require(path.join(__dirname, "..", "utils", "logEvents"));

const reqLogger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { reqLogger };
