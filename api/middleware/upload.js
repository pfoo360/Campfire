const multer = require("multer");
const path = require("path");
const multerOptions = require(path.join(
  __dirname,
  "..",
  "configs",
  "multerOptions"
));

const upload = multer({
  storage: multerOptions.storage,
  fileFilter: multerOptions.fileFilter,
  limits: {
    fileSize: multerOptions.MAX_FILE_SIZE,
  },
});

module.exports = upload;
