require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const { reqLogger } = require(path.join(__dirname, "middleware", "reqLogger"));
const { errorHandler } = require(path.join(
  __dirname,
  "middleware",
  "errorHandler"
));
const corsOptions = require(path.join(__dirname, "configs", "corsOptions"));

const PORT = process.env.PORT || 8000;
const app = express();

app.use(reqLogger);
app.use(require(path.join(__dirname, "middleware", "credentials")));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", require(path.join(__dirname, "routes", "userRoutes")));

app.use("/api/v1/auth", require(path.join(__dirname, "routes", "authRoutes")));

app.use(
  "/api/v1/upload",
  require(path.join(__dirname, "routes", "uploadRoutes"))
);

app.use(
  "/api/v1/story",
  require(path.join(__dirname, "routes", "storyRoutes"))
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
