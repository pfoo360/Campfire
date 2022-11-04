import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextEditorCSS from "./TextEditor.module.css";

function TextEditor({ story, setStory, setStoryBlur, disablingBoolean }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };
  return (
    <div className={TextEditorCSS.Container}>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={story}
        onBlur={(e) => setStoryBlur(true)}
        onChange={setStory}
        placeholder={"tell a story..."}
        readOnly={disablingBoolean}
        required
      />
    </div>
  );
}

export default TextEditor;
