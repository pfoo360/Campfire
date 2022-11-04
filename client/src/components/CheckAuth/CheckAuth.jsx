import useAuth from "../../hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const CheckAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return !auth?.userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default CheckAuth;
