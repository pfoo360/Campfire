import React from "react";
import { format } from "date-fns";
const Card = ({ story }) => {
  return (
    <div>
      <div>{story.title}</div>
      <div>{story.story}</div>
      <div>{format(new Date(story.date), "yyyy-MM-dd HH:mm:ss")}</div>
      <div>{story.id}</div>
      <div>{story.uid}</div>
      <div>{story.uname}</div>
    </div>
  );
};

export default Card;
