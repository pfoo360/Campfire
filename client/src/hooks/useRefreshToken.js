import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const REFRESH_URL = "/api/v1/auth/refresh";

    const response = await axios.get(REFRESH_URL, { withCredentials: true });

    setAuth((prev) => {
      return {
        ...prev,
        userInfo: response.data.userInfo,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
