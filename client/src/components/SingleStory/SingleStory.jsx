import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
//import image2 from "../../../../uploads/1665037305674--7ee44dc2-63b3-4253-a003-d3d68b537667.jpg";

const SingleStory = () => {
  const STORY_URL = "/api/v1/story/";
  const [story, setStory] = useState({});
  const { story_id } = useParams();
  const { auth } = useAuth();

  useEffect(() => {
    const getAStory = async () => {
      const story = await axios.get(`${STORY_URL}${story_id}`);
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
          "yyyy-MMMM-dd HH:mm:ss"
        ),
        image,
      });
    };
    getAStory();
  }, []);

  return (
    <div>
      {story.uid === auth?.userInfo?.id && <p>this is your story</p>}
      <div>{story.title}</div>
      <div>
        <Link to={`/user/${story.uname}`}>{story.uname}</Link>
      </div>
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
