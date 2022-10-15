import useAuth from "../../hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const CheckAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  console.log("incheckauth", auth);
  console.log("incheckauth", location);

  return !auth?.userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default CheckAuth;
