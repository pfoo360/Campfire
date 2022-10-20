import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
const Card = React.forwardRef(({ story }, ref) => {
  const content = (
    <>
      <div>
        <Link to={`/story/${story.id}`}>{story.title}</Link>
      </div>
      <div>{story.story}</div>
      <div>{format(new Date(story.date), "yyyy-MM-dd HH:mm:ss")}</div>
      <div>{story.id}</div>
      <div>{story.uid}</div>
      <div>{story.uname}</div>
    </>
  );

  const result = ref ? <div ref={ref}>{content}</div> : <div>{content}</div>;
  return result;
});

export default Card;
