import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    const LOGOUT_URL = "/api/v1/auth/logout";
    setAuth({});
    try {
      const response = await axios.post(
        LOGOUT_URL,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};

export default useLogout;
