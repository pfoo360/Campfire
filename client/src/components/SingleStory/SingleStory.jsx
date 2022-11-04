import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import DeleteStory from "./DeleteStory";
import * as DOMPurify from "dompurify";
import SingleStoryCSS from "./SingleStory.module.css";

const SingleStory = () => {
  const STORY_URL = "/api/v1/story/";
  const [story, setStory] = useState({});
  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteAndEditButtonDisabled, setIsDeleteAndEditButtonDisabled] =
    useState(false);

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

        let image;
        if (story.data.result[0].image) {
          image = require(`../../uploads/${story.data.result[0].image}`);
        }
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
  }, [auth?.userInfo?.id, story_id]);

  const attemptToDelete = () => {
    setOpenDeleteDialogBox(true);
  };

  return (
    <>
      {isLoading && <div className={SingleStoryCSS.Loading}>loading...</div>}
      {openDeleteDialogBox && (
        <DeleteStory
          id={story.id}
          setOpenDeleteDialogBox={setOpenDeleteDialogBox}
          setIsDeleteAndEditButtonDisabled={setIsDeleteAndEditButtonDisabled}
        />
      )}
      <h1 className={SingleStoryCSS.Title}>{story.title}</h1>
      <Link to={`/user/${story.uname}`} className={SingleStoryCSS.Author}>
        {story.uname}
      </Link>
      {story.isEditable && (
        <>
          <button
            onClick={attemptToDelete}
            disabled={isDeleteAndEditButtonDisabled}
            className={`${SingleStoryCSS.DeleteButton} ${
              isDeleteAndEditButtonDisabled
                ? SingleStoryCSS.DeleteButtonDisabled
                : ""
            }`}
          >
            🗑️
          </button>{" "}
          <button
            onClick={() => navigate("/edit", { state: { story } })}
            disabled={isDeleteAndEditButtonDisabled}
            className={`${SingleStoryCSS.EditButton} ${
              isDeleteAndEditButtonDisabled
                ? SingleStoryCSS.EditButtonDisabled
                : ""
            }`}
          >
            📝
          </button>
        </>
      )}
      <p className={SingleStoryCSS.Date}>{story.date}</p>

      <div className={SingleStoryCSS.ImgContainer}>
        {story.image && (
          <img
            src={story.image}
            alt={`story author: ${story.uname}`}
            className={SingleStoryCSS.Img}
          />
        )}
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(story.story, {
            USE_PROFILES: { html: true },
          }),
        }}
        className={SingleStoryCSS.Story}
      ></div>
    </>
  );
};

export default SingleStory;
