import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const UserPage = () => {
  const { user_id } = useParams();

  return <div>{user_id}</div>;
};

export default UserPage;
