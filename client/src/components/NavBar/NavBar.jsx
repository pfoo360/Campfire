import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import NavBarCSS from "./NavBar.module.css";

const NavBar = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className={NavBarCSS.Container}>
        <Link to="/" className={NavBarCSS.Home_link}>
          🏕️
        </Link>

        <section className={NavBarCSS.User_section}>
          {/* {auth?.userInfo?.username && (
            <p
              className={NavBarCSS.UserGreeting_paragraph}
            >{`Hello, ${auth.userInfo.username}`}</p>
        )}*/}
          {auth?.userInfo?.username && (
            <Link to="/write" className={NavBarCSS.Write_link}>
              ✍️
            </Link>
          )}
          {!auth?.userInfo?.username ? (
            <Link to="/login" className={NavBarCSS.Login_link}>
              login
            </Link>
          ) : (
            <button onClick={handleLogout} className={NavBarCSS.Logout_button}>
              logout
            </button>
          )}
        </section>
      </div>
      <Outlet />
    </>
  );
};

export default NavBar;
