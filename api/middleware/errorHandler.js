const path = require("path");
const { logEvents } = require(path.join(__dirname, "..", "utils", "logEvents"));

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log("stack", err.stack);

  // const status = res.statusCode
  //   ? res.statusCode
  //   : err.status
  //   ? err.status
  //   : 500;
  const status = err.status ? err.status : 500;
  res.status(status).json({ name: err.name, message: err.message });
};

module.exports = { errorHandler };
