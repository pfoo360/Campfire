const { format } = require("date-fns");
const path = require("path");
const Story = require(path.join(__dirname, "..", "models", "Story"));
const db = require("../configs/dbConn");

//@desc Get stories from db, returns stories based on search query OR returns all stories (default)
//@route POST /api/v1/story/?page=:page
const getStories = async (req, res, next) => {
  try {
    const pageSize = 6; //how many stories per page
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
      where,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//@desc Takes in username from params and returns all stories by said username
//@route GET /api/v1/story/user/:username
const getUsersStories = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(username);
    const stories = await Story.getStoriesByUsername({ username });
    console.log(stories);
    res.status(200).json({ stories });
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
//@route POST /api/v1/story/create
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

//@route PUT /api/v1/story/:id
const updateAStory = async (req, res, next) => {
  try {
    const { user } = req; //from access token
    const userName = user.username;
    const userId = user.id;
    // console.log(userName, userId);

    const storyId = req.params.id;

    const { title, story, updateImage, image } = req.body;
    console.log(title, story, updateImage, image);

    if (!userId || !storyId || !title || !story || !JSON.stringify(updateImage))
      return res
        .status(400)
        .json({ status: "PUT failure", message: "Invalid request" });

    const result = await Story.updateStory({
      title: title,
      story: story,
      updateImage,
      image: image || null,
      storyId,
      userId,
    });

    if (result.changedRows === 0 || result.affectedRows === 0) {
      return res.status(404).json({
        status: "PUT failure",
        message:
          "Unable to update story because storyId with corresponding userId does not exist",
        result,
      });
    } else {
      res
        .status(200)
        .json({ status: "PUT success", message: "Story updated", result });
    }

    // const result = await Story.updateStory({
    //   title: title,
    //   story: story,
    //   updateImage,
    //   image: image || null,
    //   storyId: 100,
    //   userId: 233,
    // });
    //compare user id+username with story found, if not equal, unauthorized or forbidden
    //ui=true, image=null //they want to delete a preexisitng image
    //ui=true, image=value //they want to delete a preexisting image AND upload a new image
    //ui=false image=null || image=value //they dont want to delete preexisting image OR they have no image in db
  } catch (err) {
    console.log(err);
    next(err);
  }
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
  getUsersStories,
  getAStory,
  createAStory,
  updateAStory,
  deleteAStory,
};
