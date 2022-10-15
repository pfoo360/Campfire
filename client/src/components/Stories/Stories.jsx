import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const getStories = async () => {
      console.log(query);
      const body = {
        where: {
          title: query,
          story: query,
        },
      };
      const stories = await axios.post(
        "http://localhost:8800/api/v1/story/?page=1",
        body
      );
      // console.log("result", stories.data.result);
      // console.log("currentpage", stories.data.currentPage);
      // console.log("maxnum", stories.data.maxNumberOfPages);
      // console.log("pgsize", stories.data.pageSize);
      // console.log("skipped", stories.data.storiesSkipped);
      // console.log("totalfound", stories.data.totalStoriesFound);
      setStories(stories.data.result);
    };
    getStories();
  }, [query]);
  return (
    <div>
      <button onClick={() => navigate("/register")}>register</button>
      <button onClick={() => navigate("/login")}>login</button>
      <SearchBar setter={setQuery} />
      {stories.map((story) => (
        <Card key={story.id} story={story} />
      ))}
    </div>
  );
};

export default Stories;
