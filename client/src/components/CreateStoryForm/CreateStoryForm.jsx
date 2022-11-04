import React, { useState, useEffect, useRef } from "react";
import TextEditor from "../TextEditor/TextEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UploadImageError from "./UploadImageError";
import CreateStoryFormCSS from "./CreateStoryForm.module.css";

function CreateStoryForm() {
  const UPLOAD_URL = "/api/v1/upload/";
  const CREATE_STORY_URL = "/api/v1/story/create";
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const { setAuth } = useAuth();

  const [file, setFile] = useState(null);
  const imageInputRef = useRef();
  const [uploadImageError, setUploadImageError] = useState("");

  const [title, setTitle] = useState(localStorage.getItem("title") || "");
  const [titleBlur, setTitleBlur] = useState(false);
  const [titleError, setTitleError] = useState("");

  const [story, setStory] = useState(localStorage.getItem("story") || "");
  const [storyBlur, setStoryBlur] = useState(false);
  const [storyError, setStoryError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    setTitleError("");
    if (!title) {
      setTitleError("Required");
    } else if (!/^.{1,150}$/.test(title)) {
      setTitleError("Title exceeds limit");
    }
  }, [title]);

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

  useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("story", story);
  }, [story]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const clearFile = (e) => {
    e.preventDefault();
    imageInputRef.current.value = null;
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

  const submitWithImage = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    setUploadImageError("");
    try {
      const image = await upload();
      const response = await axiosPrivate.post(
        CREATE_STORY_URL,
        { title, story, image },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSubmitSuccess("Submit success");
      localStorage.removeItem("title");
      localStorage.removeItem("story");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (!error?.response) {
        setSubmitError("No server response");
        setIsSubmitting(false);
      } else if (error?.response?.status === 401) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (
        error?.response?.data?.fileValidationError ||
        error?.response?.data?.message === "File too large"
      ) {
        setUploadImageError("Unable to upload image");
      } else {
        setSubmitError("Submit failed");
        setIsSubmitting(false);
      }
    }
  };

  const submitWithNoImage = async () => {
    setIsSubmitting(true);
    setUploadImageError("");
    setSubmitError("");
    try {
      const response = await axiosPrivate.post(
        CREATE_STORY_URL,
        { title, story },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSubmitSuccess("Submit success");
      localStorage.removeItem("title");
      localStorage.removeItem("story");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (!error?.response) {
        setSubmitError("No server response");
        setIsSubmitting(false);
      } else if (error?.response?.status === 401) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        setSubmitError("Submit failed");
        setIsSubmitting(false);
      }
    }
  };

  const submit = async (e) => {
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
      submitWithImage();
      return;
    } else if (!file) {
      submitWithNoImage();
      return;
    }
  };

  return (
    <div className={CreateStoryFormCSS.Container}>
      <div className={CreateStoryFormCSS.SubmitResultContainer}>
        {submitError && (
          <p
            className={`${CreateStoryFormCSS.Submit_paragraph} ${CreateStoryFormCSS.Submit_paragraph__error}`}
          >
            {submitError}
          </p>
        )}
        {submitSuccess && (
          <p
            className={`${CreateStoryFormCSS.Submit_paragraph} ${CreateStoryFormCSS.Submit_paragraph__success}`}
          >
            {submitSuccess}
          </p>
        )}
        {uploadImageError && (
          <UploadImageError
            submitWithNoImage={submitWithNoImage}
            setIsSubmitting={setIsSubmitting}
            setUploadImageError={setUploadImageError}
            setSubmitError={setSubmitError}
          />
        )}
      </div>
      <form onSubmit={submit}>
        <div className={CreateStoryFormCSS.CreateStory_field}>
          <label
            htmlFor="title"
            className={CreateStoryFormCSS.CreateStory_label}
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onBlur={(e) => setTitleBlur(true)}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
            className={CreateStoryFormCSS.CreateStory_input}
          />
          {titleBlur && titleError && (
            <p className={CreateStoryFormCSS.CreateStory_error}>{titleError}</p>
          )}
        </div>

        <div className={CreateStoryFormCSS.CreateStory_field}>
          <div className={CreateStoryFormCSS.CreateStoryFileInputContainer}>
            <input
              type="file"
              id="file"
              name="file"
              ref={imageInputRef}
              disabled={isSubmitting}
              onChange={handleFile}
              className={`${CreateStoryFormCSS.CreateStory_input} ${CreateStoryFormCSS.CreateStory_input__file}`}
            />
            {file && (
              <button
                onClick={clearFile}
                disabled={isSubmitting}
                className={`${CreateStoryFormCSS.CreateStory_button} ${
                  CreateStoryFormCSS.CreateStory_button__delete
                } ${
                  isSubmitting
                    ? CreateStoryFormCSS.CreateStory_button__deleteDisabled
                    : ""
                }`}
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <div className={CreateStoryFormCSS.CreateStory_field}>
          <div className={CreateStoryFormCSS.CreateStory_countContainer}>
            <p
              className={`${CreateStoryFormCSS.CreateStory_count} ${
                story.length > 9999
                  ? CreateStoryFormCSS.CreateStory_count__error
                  : ""
              }`}
            >{`${story.length}/9999`}</p>
          </div>
          <TextEditor
            story={story}
            setStory={setStory}
            setStoryBlur={setStoryBlur}
            disablingBoolean={isSubmitting}
          />
          {storyBlur && storyError && (
            <p className={CreateStoryFormCSS.CreateStory_error}>{storyError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || titleError || storyError}
          className={`${CreateStoryFormCSS.CreateStory_button} ${
            CreateStoryFormCSS.CreateStory_button__submit
          } ${
            isSubmitting || titleError || storyError
              ? CreateStoryFormCSS.CreateStory_button__submitDisabled
              : ""
          }`}
        >
          create
        </button>
      </form>
    </div>
  );
}

export default CreateStoryForm;
