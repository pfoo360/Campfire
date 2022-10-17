import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import Card from "../Card/Card";
import SearchBar from "../SearchBar/SearchBar";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Stories = () => {
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState([]);

  const auth = useAuth();
  console.log("stories", auth);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getStories = async () => {
      try {
        console.log(query);
        const body = {
          where: {
            title: query,
            story: query,
          },
        };
        const stories = await axios.post("/api/v1/story/?page=1", body, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        // console.log("result", stories.data.result);
        // console.log("currentpage", stories.data.currentPage);
        // console.log("maxnum", stories.data.maxNumberOfPages);
        // console.log("pgsize", stories.data.pageSize);
        // console.log("skipped", stories.data.storiesSkipped);
        // console.log("totalfound", stories.data.totalStoriesFound);
        isMounted && setStories(stories.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    getStories();

    return () => {
      console.log("cleanup fn");
      isMounted = false;
      controller.abort();
    };
  }, [query]);
  return (
    <div>
      <button onClick={() => navigate("/register")}>register</button>
      <button onClick={() => navigate("/login")}>login</button>
      <button onClick={() => navigate("/write")}>write</button>
      <SearchBar setter={setQuery} />
      {stories.map((story) => (
        <Card key={story.id} story={story} />
      ))}
    </div>
  );
};

export default Stories;
