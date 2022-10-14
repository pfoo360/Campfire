const path = require("path");
// const {
//   deleteRefreshTokenById,
// } = require("../../../../campfire/api/models/User");
const db = require(path.join(__dirname, "..", "configs", "dbConn"));

class User {
  constructor(payload) {
    this.email = payload.email;
    this.username = payload.username;
    this.password = payload.password;
    this.icon = payload.icon;
  }

  async save() {
    try {
      const q =
        "INSERT INTO users (email, username, password, icon) VALUES (?, ?, ?, ?)";
      const [result, column] = await db.execute(q, [
        this.email,
        this.username,
        this.password,
        this.icon || null,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async alreadyExists(payload) {
    try {
      const { email = null, username = null } = payload;
      const q = "SELECT * FROM users WHERE email = ? OR username = ?";
      const [result, column] = await db.execute(q, [email, username]);
      return result.length;
    } catch (err) {
      throw err;
    }
  }

  static async findUserByUsername(username) {
    try {
      const q = "SELECT * FROM users WHERE username = ?";
      const [result, column] = await db.execute(q, [username]);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  static async addRefreshTokenById(payload) {
    try {
      const q = "UPDATE users SET refreshToken = ? WHERE id = ?";
      const [result, column] = await db.execute(q, [
        payload.refreshToken,
        payload.id,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async findUserByRefreshToken(refreshToken) {
    try {
      const q = "SELECT * FROM users WHERE refreshToken = ?";
      const [result, column] = await db.execute(q, [refreshToken]);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteRefreshTokenById(id) {
    try {
      const q = "UPDATE users SET refreshToken = null WHERE id = ?";
      const [result, column] = await db.execute(q, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
