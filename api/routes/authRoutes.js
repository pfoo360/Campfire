const path = require("path");
const express = require("express");
const authControllers = require(path.join(
  __dirname,
  "..",
  "controllers",
  "authControllers"
));

const router = express.Router();

router.post("/login", authControllers.handleLogin);
router.get("/refresh", authControllers.handleRefreshToken);
router.post("/logout", authControllers.handleLogout);

module.exports = router;
