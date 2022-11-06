import { useParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import useUserPage from "../../hooks/useUserPage";
import UserPageCSS from "./UserPage.module.css";
import Card from "../Card/Card";

const UserPage = () => {
  const { username } = useParams();
  const [pageNumber, setPageNumber] = useState(1);

  const [stories, isLoading, isError, error, hasMore, apiSuccessfullyCalled] =
    useUserPage({
      username,
      pageNumber,
    });

  const observer = useRef();
  const lastStoryElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  return (
    <div className={UserPageCSS.Container}>
      <h1 className={UserPageCSS.User_header}>{username}</h1>
      {isError && (
        <p className={UserPageCSS.Error}>
          oops...looks like something went wrong
        </p>
      )}
      {!isLoading && apiSuccessfullyCalled && !stories.length && (
        <p className={UserPageCSS.NoStories}>
          there doesn't seem to be anything here yet...
        </p>
      )}
      <div className={UserPageCSS.CardContainer}>
        {stories.map((story, index) => {
          if (stories.length === index + 1) {
            return (
              <Card ref={lastStoryElementRef} key={story.id} story={story} />
            );
          } else return <Card key={story.id} story={story} />;
        })}
      </div>
      {isLoading && (
        <p
          className={UserPageCSS.Loading}
        >{`finding ${username}'s stories...`}</p>
      )}
    </div>
  );
};

export default UserPage;
