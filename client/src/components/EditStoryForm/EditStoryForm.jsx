import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import TextEditor from "../TextEditor/TextEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

//check to make sure user is authorized to edit
//make sure there is a story that is passed along
//populate form
//update the location object
//if user is logged out due to expired tokens send back to login, passing the location object
//no image and want to add an image(ul), no image and dont want image
// image and want to delete image(imfd), image and want to replace(ul, imfd), image and want to keep image
//image upload fn : on failure ask if they want to keep whats found in db already
// aka not modify img column in db (imfd set to false, image url='')
// or delete it (imfd=true, url='')
//if there is a img url, replace img column in db
//if imfd and no img url supplied, just delete image in column in db
//if no img and no imfd, leave it alone
//no image
//to do: grey out buttons on axios
//error handling
const EditStoryForm = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const UPLOAD_URL = "/api/v1/upload/";
  const UPDATE_URL = "/api/v1/story/";
  const STORY_ID = location?.state?.story?.id;
  //console.log(STORY_ID);
  const axiosPrivate = useAxiosPrivate();

  const [title, setTitle] = useState(location?.state?.story?.title);
  const [titleError, setTitleError] = useState("");
  const [titleBlur, setTitleBlur] = useState(false);

  const [openDeleteConfirmationDialogBox, setOpenDeleteConfirmationDialogBox] =
    useState(false);
  const [updateImage, setUpdateImage] = useState(false);

  const [file, setFile] = useState(null);
  const imageRef = useRef();

  const [story, setStory] = useState(location?.state?.story?.story);
  const [storyError, setStoryError] = useState("");
  const [storyBlur, setStoryBlur] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateFailure, setUpdateFailure] = useState(false);
  const [updateFailureMessage, setUpdateFailureMessage] = useState("");

  const navigate = useNavigate();
  //console.log("edit story location", location);

  const nav = () => {
    setAuth({});
    navigate("/login", { state: { from: location }, replace: true });
  };

  const handleTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
    location.state.story.title = e.target.value;
  };

  useEffect(() => {
    setTitleError("");
    if (!title) {
      setTitleError("Required");
    } else if (!/^.{1,150}$/.test(title)) {
      setTitleError("Title exceeds limit");
    }
  }, [title]);

  const handleFile = (e) => {
    console.log("handlefile");
    setUpdateImage(true);
    setFile(e.target.files[0]);
  };

  const clearFile = () => {
    if (!location?.state?.story?.image) {
      setUpdateImage(false);
    }
    imageRef.current.value = null;
    setFile(null);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axiosPrivate.post(UPLOAD_URL, formData);
      return response.data.result.filename;
    } catch (error) {
      throw error;
    }
  };

  const handleStory = (e) => {
    setStory(e);
    location.state.story.story = e;
  };

  const handleDeleteButtonClick = (e) => {
    e.preventDefault();
    setOpenDeleteConfirmationDialogBox(true);
  };

  const handleYesDeleteButtonClick = (e) => {
    e.preventDefault();
    setUpdateImage(true);
    setOpenDeleteConfirmationDialogBox(false);
  };

  const handleNoDeleteButtonClick = (e) => {
    e.preventDefault();
    setOpenDeleteConfirmationDialogBox(false);
  };

  useEffect(() => {
    setStoryError("");
    if (!story) {
      setStoryError("Required");
    } else if (story === "<p><br></p>") {
      setStoryError("Required");
    } else if (story.length > 9999) {
      setStoryError("Story exceeds limit");
    }
  }, [story]);

  const updateStoryWithImage = async () => {
    setUpdateSuccess(false);
    setUpdateFailure(false);
    setUpdateFailureMessage("");
    try {
      setIsUpdating(true);
      const image = await upload();
      console.log("uswi", image);
      const body = { title, story, updateImage, image };
      const response = await axiosPrivate.put(
        `${UPDATE_URL}${STORY_ID}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      setUpdateSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      setUpdateFailure(true);

      if (!error?.response) {
        setUpdateFailureMessage("No server response");
      } else if (error.response?.status === 401) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (
        error?.response?.data?.fileValidationError ||
        error?.response?.data?.message === "File too large"
      ) {
        setUpdateFailureMessage("Unable to upload image");
      } else if (error.response?.status === 404) {
        setUpdateFailureMessage(
          "storyID with corresponding userID does not exist"
        );
      } else {
        setUpdateFailureMessage("Unable to update story");
      }
      setIsUpdating(false);
    }
  };

  const updateStoryWithNoImage = async () => {
    setUpdateSuccess(false);
    setUpdateFailure(false);
    setUpdateFailureMessage("");
    try {
      setIsUpdating(true);
      const body = { title, story, updateImage, image: null };
      console.log("uswnib", body);
      const response = await axiosPrivate.put(
        `${UPDATE_URL}${STORY_ID}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      setUpdateSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      setUpdateFailure(true);
      if (!error?.response) {
        setUpdateFailureMessage("No server response");
      } else if (error?.response?.status === 401) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (error?.response?.status === 404) {
        setUpdateFailureMessage(
          "storyID with corresponding userID does not exist"
        );
      } else {
        setUpdateFailureMessage("Unable to update story");
      }
      setIsUpdating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      updateStoryWithImage();
    }
    if (!file) {
      updateStoryWithNoImage();
    }
  };

  return auth?.userInfo?.id !== location?.state?.story?.uid ||
    location?.state?.story?.id === undefined ||
    isNaN(location?.state?.story?.id) ? (
    <Navigate to="/" />
  ) : (
    <>
      {updateSuccess && <p>story updated</p>}
      {updateFailure && <p>{updateFailureMessage}</p>}
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitle}
            onBlur={() => setTitleBlur(true)}
            required
          />
          {titleBlur && titleError && <p>{titleError}</p>}
        </div>

        <div>
          {location?.state?.story?.image && !updateImage && (
            <div>
              <img
                src={location.state.story.image}
                alt={`${location?.state?.story?.uname}'s img for story with story ID ${location?.state.story?.id}`}
              />
            </div>
          )}

          <div>
            {location?.state?.story?.image &&
            !updateImage &&
            !openDeleteConfirmationDialogBox ? (
              <button onClick={handleDeleteButtonClick}>delete</button>
            ) : location?.state?.story?.image &&
              !updateImage &&
              openDeleteConfirmationDialogBox ? (
              <>
                <button onClick={handleYesDeleteButtonClick}>yes</button>
                <button onClick={handleNoDeleteButtonClick}>no</button>
              </>
            ) : null}
          </div>

          <div>
            {(!location.state.story.image || updateImage) && (
              <input
                type="file"
                id="file"
                name="file"
                ref={imageRef}
                onChange={handleFile}
              />
            )}
            {file ? <button onClick={clearFile}>delete</button> : null}
          </div>
        </div>

        <div>
          <div>{`${story.length}/9999`}</div>
          <TextEditor
            story={story}
            setStory={handleStory}
            setStoryBlur={setStoryBlur}
          />
          {storyBlur && storyError && <p>{storyError}</p>}
        </div>

        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={
            isUpdating || (titleBlur && titleError) || (storyBlur && storyError)
          }
        >
          update
        </button>

        <div>{title}</div>
        <div>{location.state.story.title}</div>
        <div>{story}</div>
        <div>{location.state.story.story}</div>
        <div>{JSON.stringify(location.state.story.uname)}</div>
        <div>{JSON.stringify(location.state.story.id)}</div>
        <div>{`updateImage, ${JSON.stringify(updateImage)}`}</div>
        <div>{`no image, ${JSON.stringify(
          !location?.state?.story?.image
        )}`}</div>
        <div>{`open dialog box, ${JSON.stringify(
          openDeleteConfirmationDialogBox
        )}`}</div>
        <div>{JSON.stringify(auth)}</div>
        <div>{JSON.stringify(location?.state?.story?.image)}</div>
        <button onClick={nav}>EditStoryForm</button>
        <button onClick={updateStoryWithImage}>updateStoryWithImage</button>
      </form>
    </>
  );
};

export default EditStoryForm;
