import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";

const UserPage = () => {
  const GET_STORIES_BY_USERNAME_URL = "/api/v1/story/user/";
  const { username } = useParams();
  const effectRan = useRef(false);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const getStoriesByUsername = async () => {
      try {
        setIsLoading(true);
        const result = await axios.get(
          `${GET_STORIES_BY_USERNAME_URL}${username}`,
          { signal: controller.signal }
        );
        console.log(result.data.stories);
        setStories(result.data.stories);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      getStoriesByUsername();
    }

    return () => {
      effectRan.current = true;
      controller.abort();
    };
  }, [username]);

  return (
    <div>
      {isLoading && <p>{`finding ${username}'s stories...`}</p>}
      {username}
      {stories.length ? (
        JSON.stringify(stories)
      ) : (
        <p>hmmm... there doesn't seem to be anything here...</p>
      )}
    </div>
  );
};

export default UserPage;
