import { Link } from "react-router-dom";
import NotFoundCSS from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={NotFoundCSS.Container}>
      <p className={NotFoundCSS.Message}>404</p>
      <Link to="/" className={NotFoundCSS.Link}>
        🏕️
      </Link>
    </div>
  );
};

export default NotFound;
