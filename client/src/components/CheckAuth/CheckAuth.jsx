import useAuth from "../../hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "../../api/axios";

const CheckAuth = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  //const REFRESH_URL = "/api/v1/auth/refresh";

  // useEffect(() => {
  //   const refresh = async () => {
  //     try {
  //       const response = await axios.get(REFRESH_URL, {
  //         withCredentials: true,
  //       });
  //       console.log("res", response);
  //       setAuth((prev) => {
  //         return {
  //           ...prev,
  //           userInfo: response.data.userInfo,
  //           accessToken: response.data.accessToken,
  //         };
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       setAuth({});
  //     }
  //   };

  //   refresh();
  // }, []);
  console.log("incheckauth", auth);

  return !auth?.userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default CheckAuth;
