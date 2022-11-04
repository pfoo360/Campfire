import React, { useState, useRef, useCallback } from "react";
import Card from "../Card/Card";
import SearchBar from "../SearchBar/SearchBar";
import useStories from "../../hooks/useStories";
import StoriesCSS from "./Stories.module.css";

const Stories = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

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

  return (
    <div className={StoriesCSS.Container}>
      <SearchBar
        setQuery={setQuery}
        query={query}
        setPageNumber={setPageNumber}
      />
      <div className={StoriesCSS.StoriesFlexBox}>
        {isLoading ? <p className={StoriesCSS.Loading}>loading...</p> : null}
        {isError ? (
          <p className={StoriesCSS.Error}>
            oops... looks like something went wrong
          </p>
        ) : null}

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
