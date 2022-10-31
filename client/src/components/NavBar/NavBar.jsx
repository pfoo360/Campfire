import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
const NavBar = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Link to="/">home</Link>
      {auth?.userInfo?.username && (
        <div>{`Hello, ${auth.userInfo.username}`}</div>
      )}
      {auth?.userInfo?.username && <Link to="/write">write</Link>}
      {!auth?.userInfo?.username ? (
        <Link to="/login">login</Link>
      ) : (
        <button onClick={handleLogout}>logout</button>
      )}

      <Outlet />
    </>
  );
};

export default NavBar;
