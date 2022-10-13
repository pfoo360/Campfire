import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function TextEditor({ story, setStory }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={story}
      onChange={setStory}
      placeholder={"tell a story..."}
    />
  );
}

export default TextEditor;
