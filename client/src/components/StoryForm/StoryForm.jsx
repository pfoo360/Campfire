import React, { useState, useEffect } from "react";
import TextEditor from "./TextEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UploadImageError from "./UploadImageError";
import * as DOMPurify from "dompurify";

function StoryForm() {
  const UPLOAD_URL = "/api/v1/upload/";
  const CREATE_STORY_URL = "/api/v1/story/create";
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const { setAuth } = useAuth();

  const [file, setFile] = useState(null);
  const [uploadImageError, setUploadImageError] = useState("");

  const [title, setTitle] = useState("");
  const [titleBlur, setTitleBlur] = useState(false);
  const [titleError, setTitleError] = useState("");

  const [story, setStory] = useState("");
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

  const handleFile = (e) => {
    setFile(e.target.files[0]);
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
      console.log(response);
      setSubmitSuccess("Submit success");
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 401) {
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
    setSubmitError("");
    setUploadImageError("");
    try {
      const response = await axiosPrivate.post(
        CREATE_STORY_URL,
        { title, story },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("submitwithnoimage", response);
      setSubmitSuccess("Submit success");
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 401) {
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
    if (file) {
      submitWithImage();
      return;
    } else if (!file) {
      submitWithNoImage();
      return;
    }
  };

  return (
    <>
      {submitError && <p>{submitError}</p>}
      {submitSuccess && <p>{submitSuccess}</p>}
      {uploadImageError && (
        <UploadImageError
          submitWithNoImage={submitWithNoImage}
          setIsSubmitting={setIsSubmitting}
          setUploadImageError={setUploadImageError}
          setSubmitError={setSubmitError}
        />
      )}
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onBlur={(e) => setTitleBlur(true)}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {titleBlur && titleError && <div>{titleError}</div>}
        </div>

        <div>
          <input type="file" id="file" name="file" onChange={handleFile} />
        </div>

        <div>
          <div>{`${story.length}/9999`}</div>
          <TextEditor
            story={story}
            setStory={setStory}
            setStoryBlur={setStoryBlur}
          />
          {storyBlur && storyError && <div>{storyError}</div>}
        </div>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            (titleBlur && titleError) ||
            (storyBlur && storyError)
          }
        >
          create
        </button>
      </form>
    </>
  );
}

export default StoryForm;

//title: 255, story: 9999
//<div
// dangerouslySetInnerHTML={{
//   __html: DOMPurify.sanitize(story, { USE_PROFILES: { html: true } }),
// }}
///>
