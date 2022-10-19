import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../api/axios";
import Card from "../Card/Card";
import SearchBar from "../SearchBar/SearchBar";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useStories from "../../hooks/useStories";

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

  return (
    <div>
      <button onClick={() => navigate("/register")}>register</button>
      <button onClick={() => navigate("/login")}>login</button>
      <button onClick={() => navigate("/write")}>write</button>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        logout
      </button>
      <SearchBar
        setQuery={setQuery}
        query={query}
        setPageNumber={setPageNumber}
      />

      <p>{isLoading}</p>
      <ul>
        {stories.map((story, index) => {
          if (stories.length === index + 1) {
            return (
              <li ref={lastStoryElementRef} key={story.id}>
                <Card story={story} />
              </li>
            );
          } else {
            return (
              <li key={story.id}>
                <Card story={story} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Stories;
