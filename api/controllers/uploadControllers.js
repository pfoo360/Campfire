//@desc saves image in 'uploads' folder and returns the image name
//@route POST /api/v1/upload/
const upload = (req, res, next) => {
  if (req.fileValidationError)
    return res.status(400).json({
      status: "POST failure",
      message: "files must be of type jpeg or png only",
      fileValidationError: req.fileValidationError,
    });

  res.status(200).json({
    status: "POST success",
    message: "File successfully uploaded",
    result: { ...req.file },
  });
};

module.exports = { upload };
