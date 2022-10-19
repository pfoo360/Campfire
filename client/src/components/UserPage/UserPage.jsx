import { useParams } from "react-router-dom";

const UserPage = () => {
  const { user_id } = useParams();

  return <div>{user_id}</div>;
};

export default UserPage;
