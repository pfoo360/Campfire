const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "client", "src", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + uuid() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    req.fileValidationError = "unsupported file types";
    cb(null, false);
  }
};

const MB = 10; //10MB
const MAX_FILE_SIZE = MB * 1024 * 1024;

module.exports = { storage, fileFilter, MAX_FILE_SIZE };
