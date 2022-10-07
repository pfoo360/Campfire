const path = require("path");
const express = require("express");
const userControllers = require(path.join(
  __dirname,
  "..",
  "controllers",
  "userControllers"
));

const router = express.Router();

router.post("/", userControllers.createNewUser);
router.put("/", userControllers.updateUser);
router.delete("/", userControllers.deleteUser);

module.exports = router;
