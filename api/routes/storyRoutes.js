const path = require("path");
const express = require("express");
const storyControllers = require(path.join(
  __dirname,
  "..",
  "controllers",
  "storyControllers"
));
const verifyJWT = require(path.join(
  __dirname,
  "..",
  "middleware",
  "verifyJWT"
));

const router = express.Router();

router.post("/", storyControllers.getStories);

router.get("/:id", storyControllers.getAStory);

router.get("/user/:username/:page", storyControllers.getUsersStories);

router.post("/create", verifyJWT, storyControllers.createAStory);

router.put("/:id", verifyJWT, storyControllers.updateAStory);

router.delete("/:id", verifyJWT, storyControllers.deleteAStory);

module.exports = router;
