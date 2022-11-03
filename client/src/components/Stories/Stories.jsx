import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../api/axios";
import Card from "../Card/Card";
import SearchBar from "../SearchBar/SearchBar";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useStories from "../../hooks/useStories";
import StoriesCSS from "./Stories.module.css";

const Stories = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const auth = useAuth();
  const navigate = useNavigate();

  const logout = useLogout();

  const [stories, isLoading, isError, error, hasMore] = useStories({
    query,
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

  const btn = async (e) => {
    e.preventDefault();
    const result = await axios.get("/api/v1/story/user/coolguy123");
    console.log(result);
  };

  return (
    <div className={StoriesCSS.Container}>
      {/*<button onClick={() => navigate("/register")}>register</button>
      <button onClick={() => navigate("/edit")}>edit</button>
  <button onClick={btn}>user</button>*/}
      <SearchBar
        setQuery={setQuery}
        query={query}
        setPageNumber={setPageNumber}
      />
      <div className={StoriesCSS.StoriesFlexBox}>
        {isLoading ? <p className={StoriesCSS.Loading}>loading...</p> : null}

        {stories.map((story, index) => {
          if (stories.length === index + 1) {
            return (
              <Card ref={lastStoryElementRef} key={story.id} story={story} />
            );
          } else return <Card key={story.id} story={story} />;
        })}
      </div>
    </div>
  );
};

export default Stories;
