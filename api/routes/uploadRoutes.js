const express = require("express");
const path = require("path");
const upload = require(path.join(__dirname, "..", "middleware", "upload"));
const uploadControllers = require(path.join(
  __dirname,
  "..",
  "controllers",
  "uploadControllers"
));
const verifyJWT = require(path.join(
  __dirname,
  "..",
  "middleware",
  "verifyJWT"
));

const router = express.Router();

router.post("/", verifyJWT, upload.single("image"), uploadControllers.upload);

module.exports = router;
