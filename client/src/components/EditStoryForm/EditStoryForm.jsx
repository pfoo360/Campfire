import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import TextEditor from "../TextEditor/TextEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EditStoryFormCSS from "./EditStoryForm.module.css";

const EditStoryForm = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const UPLOAD_URL = "/api/v1/upload/";
  const UPDATE_URL = "/api/v1/story/";
  const STORY_ID = location?.state?.story?.id;

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

      setUpdateSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
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
      const response = await axiosPrivate.put(
        `${UPDATE_URL}${STORY_ID}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUpdateSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
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
    if (
      !title ||
      !/^.{1,150}$/.test(title) ||
      !story ||
      story === "<p><br></p>" ||
      story.length > 9999
    )
      return;
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
    <div className={EditStoryFormCSS.Container}>
      <div className={EditStoryFormCSS.SubmitResult}>
        {updateSuccess && (
          <p
            className={`${EditStoryFormCSS.SubmitResult_paragraph} ${EditStoryFormCSS.SubmitResult_paragraph__success}`}
          >
            story updated
          </p>
        )}
        {updateFailure && (
          <p
            className={`${EditStoryFormCSS.SubmitResult_paragraph} ${EditStoryFormCSS.SubmitResult_paragraph__failure}`}
          >
            {updateFailureMessage}
          </p>
        )}
      </div>

      <form>
        <div className={EditStoryFormCSS.EditStory_field}>
          <label htmlFor="title" className={EditStoryFormCSS.EditStory_label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitle}
            onBlur={() => setTitleBlur(true)}
            disabled={isUpdating}
            required
            className={EditStoryFormCSS.EditStory_input}
          />
          {titleBlur && titleError && (
            <p className={EditStoryFormCSS.EditStory_error}>{titleError}</p>
          )}
        </div>

        <div className={EditStoryFormCSS.EditStoryContainer}>
          {location?.state?.story?.image && !updateImage && (
            <div className={EditStoryFormCSS.EditStoryImageContainer}>
              <img
                src={location.state.story.image}
                alt={`${location?.state?.story?.uname}'s img for story with story ID ${location?.state.story?.id}`}
                className={EditStoryFormCSS.EditStory_image}
              />
            </div>
          )}

          <div className={EditStoryFormCSS.EditStoryImageInputContainer}>
            {(!location.state.story.image || updateImage) && (
              <input
                type="file"
                id="file"
                name="file"
                ref={imageRef}
                onChange={handleFile}
                disabled={isUpdating}
                className={`${EditStoryFormCSS.EditStory_input} ${EditStoryFormCSS.EditStory_input__file}`}
              />
            )}
            {file ? (
              <button
                onClick={clearFile}
                disabled={isUpdating}
                className={`${EditStoryFormCSS.EditStory_button} ${
                  EditStoryFormCSS.EditStory_button__red
                } ${
                  isUpdating
                    ? EditStoryFormCSS.EditStory_button__redDisabled
                    : ""
                }`}
              >
                🗑️
              </button>
            ) : null}
          </div>

          <div className={EditStoryFormCSS.ButtonsContainer}>
            {location?.state?.story?.image &&
            !updateImage &&
            !openDeleteConfirmationDialogBox ? (
              <button
                onClick={handleDeleteButtonClick}
                disabled={isUpdating}
                className={`${EditStoryFormCSS.EditStory_button} ${
                  EditStoryFormCSS.EditStory_button__red
                } ${
                  isUpdating
                    ? EditStoryFormCSS.EditStory_button__redDisabled
                    : ""
                }`}
              >
                🗑️
              </button>
            ) : location?.state?.story?.image &&
              !updateImage &&
              openDeleteConfirmationDialogBox ? (
              <>
                <button
                  onClick={handleNoDeleteButtonClick}
                  disabled={isUpdating}
                  className={`${EditStoryFormCSS.EditStory_button} ${
                    EditStoryFormCSS.EditStory_button__green
                  } ${
                    isUpdating
                      ? EditStoryFormCSS.EditStory_button__greenDisabled
                      : ""
                  }`}
                >
                  no
                </button>
                <button
                  onClick={handleYesDeleteButtonClick}
                  disabled={isUpdating}
                  className={`${EditStoryFormCSS.EditStory_button} ${
                    EditStoryFormCSS.EditStory_button__red
                  } ${
                    isUpdating
                      ? EditStoryFormCSS.EditStory_button__redDisabled
                      : ""
                  }`}
                >
                  yes
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className={EditStoryFormCSS.EditStory_field}>
          <div className={EditStoryFormCSS.EditStory_countContainer}>
            <p
              className={`${EditStoryFormCSS.EditStory_count} ${
                story.length > 9999
                  ? EditStoryFormCSS.EditStory_count__error
                  : ""
              }`}
            >{`${story.length}/9999`}</p>
          </div>
          <TextEditor
            story={story}
            setStory={handleStory}
            setStoryBlur={setStoryBlur}
            disablingBoolean={isUpdating}
          />
          {storyBlur && storyError && (
            <p className={EditStoryFormCSS.EditStory_error}>{storyError}</p>
          )}
        </div>

        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={isUpdating || titleError || storyError}
          className={`${EditStoryFormCSS.EditStory_button} ${
            EditStoryFormCSS.EditStory_button__submit
          } ${
            isUpdating || titleError || storyError
              ? EditStoryFormCSS.EditStory_button__submitDisabled
              : ""
          }`}
        >
          update
        </button>
      </form>
    </div>
  );
};

export default EditStoryForm;
