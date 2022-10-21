import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import TextEditor from "../TextEditor/TextEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

//check to make sure user is authorized to edit
//make sure there is a story that is passed along
//populate form
//update the location object
//if user is logged out due to expired tokens send back to login, passing the location object
const EditStoryForm = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const UPLOAD_URL = "/api/v1/upload/";
  const axiosPrivate = useAxiosPrivate();

  const [title, setTitle] = useState(location?.state?.story?.title);
  const [titleError, setTitleError] = useState("");
  const [titleBlur, setTitleBlur] = useState(false);

  const [openDeleteConfirmationDialogBox, setOpenDeleteConfirmationDialogBox] =
    useState(false);
  const [imageMarkedForDelete, setImageMarkedForDelete] = useState(false);

  const [file, setFile] = useState(null);
  const [uploadImageError, setUploadImageError] = useState("");

  const [story, setStory] = useState(location?.state?.story?.story);
  const [storyError, setStoryError] = useState("");
  const [storyBlur, setStoryBlur] = useState(false);

  const navigate = useNavigate();
  console.log("edit story location", location);

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
    setFile(e.target.files[0]);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axiosPrivate.post(UPLOAD_URL, formData);
      console.log(response.data.result.filename);
    } catch (error) {
      console.log(error);
      setUploadImageError("Unable to upload image");
    }
  };

  const handleStory = (e) => {
    setStory(e);
    location.state.story.story = e;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("click");
  };

  return auth?.userInfo?.id !== location?.state?.story?.uid ? (
    <Navigate to="/" />
  ) : (
    <form onSubmit={handleSubmit}>
      {uploadImageError && <p>{uploadImageError}</p>}

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
        {location?.state?.story?.image && !imageMarkedForDelete && (
          <div>
            <img src={location.state.story.image} />
          </div>
        )}

        <div>
          {location?.state?.story?.image &&
          !imageMarkedForDelete &&
          !openDeleteConfirmationDialogBox ? (
            <button onClick={() => setOpenDeleteConfirmationDialogBox(true)}>
              delete
            </button>
          ) : location?.state?.story?.image &&
            !imageMarkedForDelete &&
            openDeleteConfirmationDialogBox ? (
            <>
              <button
                onClick={() => {
                  setImageMarkedForDelete(true);
                  setOpenDeleteConfirmationDialogBox(false);
                }}
              >
                yes
              </button>
              <button onClick={() => setOpenDeleteConfirmationDialogBox(false)}>
                no
              </button>
            </>
          ) : null}
        </div>

        {(!location.state.story.image || imageMarkedForDelete) && (
          <input type="file" id="file" name="file" onChange={handleFile} />
        )}
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

      <button type="submit">update</button>

      <div>{title}</div>
      <div>{location.state.story.title}</div>
      <div>{story}</div>
      <div>{location.state.story.story}</div>
      <div>{`imageMarkedfordelete, ${JSON.stringify(
        imageMarkedForDelete
      )}`}</div>
      <div>{`no image, ${JSON.stringify(!location?.state?.story?.image)}`}</div>
      <div>{`open dialog box, ${JSON.stringify(
        openDeleteConfirmationDialogBox
      )}`}</div>
      <div>{console.log(file)}</div>
      <div>{JSON.stringify(auth)}</div>
      <div>{JSON.stringify(location?.state?.story?.image)}</div>
      <button onClick={nav}>EditStoryForm</button>
      <button onClick={upload}>upload</button>
    </form>
  );
};

export default EditStoryForm;
