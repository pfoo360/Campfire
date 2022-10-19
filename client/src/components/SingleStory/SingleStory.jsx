import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
//import image2 from "../../../../uploads/1665037305674--7ee44dc2-63b3-4253-a003-d3d68b537667.jpg";

const SingleStory = () => {
  const [story, setStory] = useState({});

  useEffect(() => {
    const getAStory = async () => {
      const story = await axios.get("http://localhost:8800/api/v1/story/11");
      //console.log(story);
      let image;
      //console.log("result", story.data.result[0]);
      //console.log("result", story.data.result[0].image);
      if (story.data.result[0].image) {
        //console.log(`../../uploads/${story.data.result[0].image}`);
        image = require(`../../uploads/${story.data.result[0].image}`);
      }
      //console.log(image);
      setStory({
        ...story.data.result[0],
        date: format(
          new Date(story.data.result[0].date),
          "yyyy-MM-dd HH:mm:ss"
        ),
        image,
      });
    };
    getAStory();
  }, []);

  return (
    <div>
      <div>{story.title}</div>
      <div>{story.uname}</div>
      <div>{story.date}</div>
      {story.image && <img src={story.image} alt="" />}
      {/*<img
        src="https://images.unsplash.com/photo-1665250998590-d222b025f3b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
        alt=""
  />*/}
      <div>{story.story}</div>
    </div>
  );
};

export default SingleStory;
