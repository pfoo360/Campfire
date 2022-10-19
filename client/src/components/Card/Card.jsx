import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
const Card = ({ story }) => {
  return (
    <div>
      <div>
        <Link to={`/story/${story.id}`}>{story.title}</Link>
      </div>
      <div>{story.story}</div>
      <div>{format(new Date(story.date), "yyyy-MM-dd HH:mm:ss")}</div>
      <div>{story.id}</div>
      <div>{story.uid}</div>
      <div>{story.uname}</div>
    </div>
  );
};

export default Card;
