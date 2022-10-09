const { format } = require("date-fns");
const path = require("path");
const Story = require(path.join(__dirname, "..", "models", "Story"));
const db = require("../configs/dbConn");

//@desc Get stories from db, returns stories based on search query OR returns all stories (default)
//@route GET /api/v1/story/?page=:page
const getStories = async (req, res, next) => {
  try {
    const pageSize = 2; //how many stories per page
    const { page } = req.query;
    if (isNaN(page))
      return res
        .status(400)
        .json({ status: "GET failure", message: "page is NaN" });

    const offset = pageSize * (page - 1);
    const { where } = req.body;
    console.log(where);

    const [result, count] = await Story.getStories({
      where: {
        title: where?.title,
        story: where?.story,
      },
      offset: offset,
      limit: pageSize,
    });

    const totalStoriesFound = count[0]["COUNT (*)"];
    const maxNumberOfPages = Math.ceil(totalStoriesFound / pageSize);
    const currentPage = parseInt(page);
    res.json({
      result,
      totalStoriesFound,
      currentPage,
      pageSize,
      storiesSkipped: offset,
      maxNumberOfPages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//@desc Get a single story from db
//@route GET /api/v1/story/:id
const getAStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "GET failure", message: "Missing id" });

    const getResult = await Story.getStoryById(id);
    if (!getResult.length)
      return res.status(404).json({
        status: "GET failure",
        message: `Story with id ${id} not found`,
        result: getResult,
      });

    res.status(200).json({
      status: "GET success",
      message: `Story with id ${id} found`,
      result: getResult,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//@desc Adds a story in db
//@route POST /api/v1/story/
const createAStory = async (req, res, next) => {
  try {
    const { title, story, image = null } = req.body;
    if (!title || !story)
      return res.status(400).json({
        status: "POST failure",
        message: "Title and story are required",
      });

    const { username, id } = req.user;

    const newStory = new Story({
      title: title,
      story: story,
      image: image,
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      uid: id,
      uname: username,
    });
    const result = await newStory.save();
    res.status(200).json({
      status: "POST success",
      message: "Story created",
      result: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateAStory = (req, res, next) => {
  res.send("updateStories");
};

//@desc Delete story in db
//@route DELETE /api/v1/story/:id
const deleteAStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.id; //from access token
    const userName = req.user.username; //from access token

    if (!storyId)
      return res
        .status(400)
        .json({ status: "DELETE failure", message: "Missing id" });

    const getResult = await Story.getStoryById(storyId);

    if (!getResult.length)
      return res.status(404).json({
        status: "DELETE failure",
        message: `Story with id ${storyId} not found`,
      });

    if (getResult[0].uid !== userId && getResult[0].uname !== userName)
      return res
        .status(403)
        .json({ status: "DELETE failure", message: "Forbidden" });

    const deleteResult = await Story.deleteStoryById(storyId);
    console.log(deleteResult);
    res.status(200).json({
      status: "DELETE success",
      message: "Successfully deleted",
      result: deleteResult,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getStories,
  getAStory,
  createAStory,
  updateAStory,
  deleteAStory,
};
