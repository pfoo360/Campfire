import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
  const effectRan = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
        } catch (error) {
          console.error(error);
        } finally {
          isMounted && setIsLoading(false);
        }
      };

      !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }

    return () => {
      isMounted = false;
      effectRan.current = true;
    };
  }, []);

  useEffect(() => {
    console.log("persist", auth);
  }, [auth, isLoading]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
