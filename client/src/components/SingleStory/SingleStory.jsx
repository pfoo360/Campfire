import React, { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import DeleteStory from "./DeleteStory";
//import image2 from "../../../../uploads/1665037305674--7ee44dc2-63b3-4253-a003-d3d68b537667.jpg";

const SingleStory = () => {
  const STORY_URL = "/api/v1/story/";
  const [story, setStory] = useState({});
  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const effectRan = useRef(false);

  const { story_id } = useParams();
  const { auth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const getAStory = async () => {
      try {
        setIsLoading(true);
        const story = await axios.get(`${STORY_URL}${story_id}`, {
          signal: controller.signal,
        });
        console.log(story);
        // console.log(auth?.userInfo?.id);
        // console.log(story.data.result[0].uid);
        // console.log(story.data.result[0].uid === auth?.userInfo?.id);
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
          isEditable: story.data.result[0].uid === auth?.userInfo?.id,
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      getAStory();
    }

    return () => {
      effectRan.current = true;
      controller.abort();
    };
  }, []);

  const attemptToDelete = () => {
    setOpenDeleteDialogBox(true);
  };

  // const [arr, setArr] = useState([1, 2, 3]);
  // const add = () => {
  //   console.log(123);
  //   setArr((prev) => [...prev, arr.length + 1]);
  //   console.log(456);
  // };

  // const hello = () => {
  //   console.log(78);
  //   console.log("hello");
  //   console.log(89);
  // };
  // const test = "sdf";
  // const last = useCallback(
  //   (node) => {
  //     console.log(node);
  //     console.log("sdfsdfdf");
  //   },
  //   [test]
  // );

  return (
    <div>
      {isLoading && <div>loading...</div>}
      {/*arr.map((el, ind) => {
        console.log(el);
        if (arr.length === ind + 1) {
          console.log(el, ind);
          return <div ref={last}>{el}</div>;
          console.log("222222222222222");
        }
        return <div>{el}</div>;
      })*/}
      {/*<button onClick={add}>c</button>*/}
      {openDeleteDialogBox && (
        <DeleteStory
          id={story.id}
          setOpenDeleteDialogBox={setOpenDeleteDialogBox}
        />
      )}
      <div>{story.title}</div>
      <div>
        <Link to={`/user/${story.uname}`}>{story.uname}</Link>
      </div>
      {story.isEditable && (
        <>
          <button onClick={attemptToDelete}>this is your post</button>
          <button onClick={() => navigate("/edit", { state: { story } })}>
            edit
          </button>
        </>
      )}
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
