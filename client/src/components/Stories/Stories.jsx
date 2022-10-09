import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import SearchBar from "../SearchBar/SearchBar";

const Stories = () => {
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const getStories = async () => {
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
      console.log("result", stories.data.result);
      console.log("currentpage", stories.data.currentPage);
      console.log("maxnum", stories.data.maxNumberOfPages);
      console.log("pgsize", stories.data.pageSize);
      console.log("skipped", stories.data.storiesSkipped);
      console.log("totalfound", stories.data.totalStoriesFound);
      setStories(stories.data.result);
    };
    getStories();
  }, [query]);
  return (
    <div>
      <SearchBar setter={setQuery} />
      {stories.map((story) => (
        <Card key={story.id} story={story} />
      ))}
    </div>
  );
};

export default Stories;
