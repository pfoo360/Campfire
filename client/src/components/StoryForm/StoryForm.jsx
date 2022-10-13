import React, { useState, useEffect } from "react";
import TextEditor from "./TextEditor";
import * as DOMPurify from "dompurify";

function StoryForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [titleBlur, setTitleBlur] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [image, setImage] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = (e) => {
    setTitleBlur(true);
  };

  useEffect(() => {
    setTitleError(false);
    if (!title) {
      setTitleError("Required");
    } else if (!/^.{1,150}$/.test(title)) {
      setTitleError("Title too long!");
    }
  }, [title]);

  useEffect(() => {
    setStoryError("");
    if (!story) {
      setStoryError("Required");
    } else if (story.length <= 11) {
      setStoryError("Too short!");
    } else if (story.length > 9999) {
      setStoryError("Too long!");
    }
  }, [story]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const upload = () => {
    const formData = new FormData();
    formData.append("image", file);

    for (const [key, value] of formData) {
      console.log(key, value);
    }
    console.log(formData);
  };

  const test = () => {
    console.log("hi");
    upload();
  };

  return (
    <>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onBlur={handleTitleBlur}
            onChange={handleTitleChange}
          />
          {titleBlur && titleError && <div>{titleError}</div>}
        </div>

        <div>
          <input type="file" id="file" name="file" onChange={handleFile} />
        </div>

        <div>
          <div>{`${story.length - 7 < 0 ? 0 : story.length - 7}/9992`}</div>
          <TextEditor story={story} setStory={setStory} />
        </div>
      </form>
      <button onClick={() => test()}>test</button>
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
