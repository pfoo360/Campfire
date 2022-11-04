import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import PersistLoginCSS from "./PersistLogin.module.css";

const PersistLogin = () => {
  const effectRan = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

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

  return (
    <>
      {isLoading ? (
        <div className={PersistLoginCSS.Container}>
          <p className={PersistLoginCSS.Loading}>Loading...</p>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
