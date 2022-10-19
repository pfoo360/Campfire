import axios from "../api/axios";
import { useState, useEffect, useRef } from "react";

function useStories({ query, pageNumber }) {
  const STORIES_URL = "/api/v1/story/";

  const effectRan = useRef(false);

  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      isMounted && setStories([]);
    }

    return () => {
      effectRan.current = true;
      isMounted = false;
    };
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});
    let isMounted = true;
    const controller = new AbortController();

    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const getStories = async () => {
        try {
          const body = {
            where: {
              title: query,
              story: query,
            },
          };

          const { data } = await axios.post(
            `${STORIES_URL}?page=${pageNumber}`,
            body,
            {
              headers: {
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );
          console.log(data);
          isMounted && setStories((prev) => [...prev, ...data.result]);
          isMounted && setHasMore(data.currentPage < data.maxNumberOfPages);
          isMounted && setIsLoading(false);
        } catch (error) {
          isMounted && setIsLoading(false);
          if (controller.signal.aborted) return;
          isMounted && setIsError(true);
          isMounted && setError(JSON.stringify(error));
        }
      };

      getStories();
    }

    return () => {
      effectRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, [query, pageNumber]);

  return [stories, isLoading, isError, error, hasMore];
}

export default useStories;
