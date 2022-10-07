const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User"));
const bcrypt = require("bcrypt");

//@desc Register new user to db
//@route POST /api/v1/user
const createNewUser = async (req, res, next) => {
  try {
    const { email, username, password, icon = null } = req.body;
    if (!email || !username || !password)
      return res
        .status(400)
        .json({ message: "Missing email, username, or password" });

    if (await User.alreadyExists({ email, username }))
      return res
        .status(409)
        .json({ message: "Username and/or email already in use" });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      username: username,
      password: hashedPwd,
      icon: icon,
    });

    const result = await newUser.save();

    res.status(200).json({ message: "User successfully created", result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//@desc Update user information in db
//@route PUT /api/v1/user
const updateUser = (req, res, next) => {
  res.send("update");
};

//@desc Delete user in db
//@route DELETE /api/v1/user
const deleteUser = (req, res, next) => {
  res.send("delete");
};

module.exports = { createNewUser, updateUser, deleteUser };
