import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";

const useUserPage = ({ username, pageNumber }) => {
  const GET_STORIES_BY_USERNAME_URL = "/api/v1/story/user";

  const effectRanOne = useRef(false);
  const isMountedRefOne = useRef(false);
  const effectRanTwo = useRef(false);
  const isMountedRefTwo = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [apiSuccessfullyCalled, setApiSuccessfullyCalled] = useState(false);

  useEffect(() => {
    isMountedRefOne.current = true;
    if (
      effectRanOne.current === true ||
      process.env.NODE_ENV !== "development"
    ) {
      isMountedRefOne.current && setStories([]);
    }

    return () => {
      effectRanOne.current = true;
      isMountedRefOne.current = false;
    };
  }, [username]);

  useEffect(() => {
    isMountedRefTwo.current = true;
    setIsLoading(true);
    setIsError(false);
    setError({});
    const controller = new AbortController();

    const getStoriesByUsername = async () => {
      try {
        setApiSuccessfullyCalled(false);
        const result = await axios.get(
          `${GET_STORIES_BY_USERNAME_URL}/${username}/${pageNumber}`,
          { signal: controller.signal }
        );
        setApiSuccessfullyCalled(true);
        isMountedRefTwo.current &&
          setStories((prev) => [...prev, ...result.data.result]);
        isMountedRefTwo.current &&
          setHasMore(result.data.currentPage < result.data.maxNumberOfPages);
        isMountedRefTwo.current && setIsLoading(false);
      } catch (error) {
        isMountedRefTwo.current && setIsLoading(false);
        if (controller.signal.aborted) return;
        isMountedRefTwo.current && setIsError(true);
        isMountedRefTwo.current && setError(JSON.stringify(error));
      }
    };

    if (
      effectRanTwo.current === true ||
      process.env.NODE_ENV !== "development"
    ) {
      isMountedRefTwo.current && getStoriesByUsername();
    }

    return () => {
      controller.abort();
      effectRanTwo.current = true;
      isMountedRefTwo.current = false;
    };
  }, [username, pageNumber]);

  return [stories, isLoading, isError, error, hasMore, apiSuccessfullyCalled];
};

export default useUserPage;
