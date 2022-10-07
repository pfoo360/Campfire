const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require(path.join(__dirname, "..", "models", "User"));
const jwtConfig = require(path.join(__dirname, "..", "configs", "jwtConfig"));
const cookieConfig = require(path.join(
  __dirname,
  "..",
  "configs",
  "cookieConfig"
));

//@desc Logs in users, issues access token (returned as a res) and refresh token (saved in http only cookie)
//@route POST /api/v1/auth/login
const handleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and/or password is required" });

    const foundUser = await User.findUserByUsername(username);
    if (!foundUser) return res.status(401).json({ message: "unauthorized" });

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const jwtPayload = {
        username: foundUser.username,
        id: foundUser.id,
      };
      const accessToken = jwt.sign(
        jwtPayload,
        process.env.ACCESS_TOKEN_SECRET,
        jwtConfig.ACCESS_CONFIG
      );
      const refreshToken = jwt.sign(
        jwtPayload,
        process.env.REFRESH_TOKEN_SECRET,
        jwtConfig.REFRESH_CONFIG
      );

      const result = await User.addRefreshTokenById({
        refreshToken: refreshToken,
        id: foundUser.id,
      });

      res.cookie("jwt", refreshToken, cookieConfig.JWT_CONFIG);

      const userInfo = {
        username: foundUser.username,
        id: foundUser.id,
        icon: foundUser.icon,
      };
      res
        .status(200)
        .json({ message: "Login successful", userInfo, accessToken });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//@desc Issues new access token to user if user's refresh token is valid
//@route POST /api/v1/auth/refresh
const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "unauthorized" });

    refreshToken = cookies.jwt;

    const foundUser = await User.findUserByRefreshToken(refreshToken);
    if (!foundUser) return res.status(403).json({ message: "forbidden" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (
          err ||
          decoded.id !== foundUser.id ||
          decoded.username !== foundUser.username
        )
          return res.status(403).json({ message: "forbidden" });

        const jwtPayload = {
          username: decoded.username,
          id: decoded.id,
        };

        const accessToken = jwt.sign(
          jwtPayload,
          process.env.ACCESS_TOKEN_SECRET,
          jwtConfig.ACCESS_CONFIG
        );

        const userInfo = {
          username: foundUser.username,
          id: foundUser.id,
          icon: foundUser.icon,
        };
        res
          .status(200)
          .json({ message: "refresh access token", userInfo, accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//@desc Logs out users, delete refresh token in cookie and in db
//@route POST /api/v1/auth/logout
const handleLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    //is refresh token in db?
    const foundUser = await User.findUserByRefreshToken(refreshToken);
    //dont have refresh token in db but have in cookies
    if (!foundUser) {
      res.clearCookie("jwt", cookieConfig.JWT_CONFIG);
      return res.sendStatus(204);
    }

    //refresh token in cookie is same refresh token in db
    const result = await User.deleteRefreshTokenById(foundUser.id);
    res.clearCookie("jwt", cookieConfig.JWT_CONFIG);
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { handleLogin, handleRefreshToken, handleLogout };
