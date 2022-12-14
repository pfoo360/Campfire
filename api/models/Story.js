const path = require("path");
// const { deleteAStory } = require("../controllers/storyControllers");
const db = require(path.join(__dirname, "..", "configs", "dbConn"));
const { format } = require("date-fns");

class Story {
  constructor(payload) {
    this.title = payload.title;
    this.story = payload.story;
    this.image = payload.image;
    this.date = payload.date;
    this.uid = payload.uid;
    this.uname = payload.uname;
  }

  async save() {
    try {
      const q =
        "INSERT INTO stories (title, story, image, date, uid, uname) VALUES (?, ?, ?, ?, ?, ?)";
      const [result, column] = await db.execute(q, [
        this.title,
        this.story,
        this.image || null,
        this.date,
        this.uid,
        this.uname,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getStories(payload) {
    // other methods to use:
    // "SELECT * FROM stories JOIN (SELECT COUNT(*) FROM stories WHERE story LIKE '%nulla%') counted WHERE story LIKE '%nulla%' LIMIT 0,3";

    // "SELECT SQL_CALC_FOUND_ROWS * FROM stories WHERE story LIKE '%nulla%' LIMIT 0,3";
    // "SELECT FOUND_ROWS()

    // `SELECT * FROM stories WHERE story LIKE '%nulla%' LIMIT 0, 3`
    // `SELECT COUNT(*) FROM stories WHERE  story LIKE '%nulla%'`

    try {
      const { where, offset, limit } = payload;
      let result, count;
      //console.log(where, where?.title, where?.story, offset, limit);

      if (where?.title || where?.story) {
        const resultQ = `SELECT * FROM stories WHERE ${
          where.title && where.story
            ? `story LIKE '%${where.story}%' OR title LIKE '%${where.title}%'`
            : where.story
            ? `story LIKE '%${where.story}%'`
            : `title LIKE '%${where.title}%'`
        } ORDER BY date DESC LIMIT ${offset}, ${limit}`;

        const countQ = `SELECT COUNT (*) FROM stories WHERE ${
          where.title && where.story
            ? `story LIKE '%${where.story}%' OR title LIKE '%${where.title}%'`
            : where.story
            ? `story LIKE '%${where.story}%'`
            : `title LIKE '%${where.title}%'`
        }`;

        [result, count] = await Promise.all([
          db.execute(resultQ),
          db.execute(countQ),
        ]);
        return [result[0], count[0]];
      } else {
        [result, count] = await Promise.all([
          db.execute(
            `SELECT * FROM stories ORDER BY date DESC LIMIT ${offset}, ${limit}`
          ),
          db.execute("SELECT COUNT (*) FROM stories"),
        ]);
        return [result[0], count[0]];
      }
    } catch (err) {
      throw err;
    }
  }

  static async getStoryById(id) {
    try {
      const q = "SELECT * FROM stories WHERE id = ?";
      const [result, column] = await db.execute(q, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getStoriesByUsername({ username, offset, limit }) {
    try {
      const resultQ = `SELECT stories.id, stories.title, stories.story, stories.date FROM stories WHERE uid IN (SELECT users.id FROM users WHERE users.username = ?) ORDER BY date DESC LIMIT ${offset} , ${limit}`;

      const countQ = `SELECT COUNT (*) FROM stories where uid IN (SELECT users.id FROM users WHERE users.username = ?)`;

      const [result, count] = await Promise.all([
        db.execute(resultQ, [username]),
        db.execute(countQ, [username]),
      ]);
      return [result[0], count[0]];
    } catch (err) {
      throw err;
    }
  }

  static async updateStory({
    userId,
    title,
    story,
    updateImage,
    image,
    storyId,
  }) {
    try {
      if (updateImage) {
        const q =
          "UPDATE stories SET title = ?, story = ?, image = ?, date = ? WHERE id = ? AND uid = ?";
        const [result, col] = await db.execute(q, [
          title,
          story,
          image,
          format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          storyId,
          userId,
        ]);
        return result;
      }

      if (!updateImage) {
        const q =
          "UPDATE stories SET title = ?, story = ?, date = ? WHERE id = ? AND uid = ?";
        const [result, col] = await db.execute(q, [
          title,
          story,
          format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          storyId,
          userId,
        ]);
        return result;
      }
    } catch (err) {
      throw err;
    }
  }

  static async deleteStoryById(id) {
    try {
      const q = "DELETE FROM stories WHERE id = ?";
      const [result, column] = await db.execute(q, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Story;
