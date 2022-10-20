import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

///api/v1/story/:id
const DeleteStory = ({ id }) => {
  const DELETE_URL = "/api/v1/story/";
  const axiosPrivate = useAxiosPrivate();
  const [isDisabled, setIsDisabled] = useState(false);

  const deleteStory = async () => {
    try {
      setIsDisabled(true);
      const response = await axiosPrivate.delete(`${DELETE_URL}${id}`);

      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  };
  return (
    <>
      <div>{id}</div>
      <button onClick={deleteStory} disabled={isDisabled}>
        delete
      </button>
    </>
  );
};

export default DeleteStory;
