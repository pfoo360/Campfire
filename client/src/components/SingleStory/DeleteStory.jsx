import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

//DELETE story URL: /api/v1/story/:id
const DeleteStory = ({ id, setOpenDeleteDialogBox }) => {
  const DELETE_URL = "/api/v1/story/";
  const axiosPrivate = useAxiosPrivate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  const deleteStory = async () => {
    setDeleteSuccess(false);
    setDeleteError("");
    try {
      setButtonDisabled(true);
      const response = await axiosPrivate.delete(`${DELETE_URL}${id}`);
      console.log("delete response", response);
      setDeleteSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log("delete error", error);
      //403= forbidden bc access token not valid/expired
      //403=story found in db but does not match with userinfo sent by user
      //404 not found in db
      //401=unauthorized bc refresh token also expried
      if (!error?.response) {
        setDeleteError("No server response");
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setDeleteError("Forbidden");
      } else if (error.response?.status === 404) {
        setDeleteError("Story not found");
      } else {
        setDeleteError("Delete failed");
      }
      setButtonDisabled(false);
      //setOpenDeleteDialogBox(false);
    }
  };

  const doNotDeleteStory = () => {
    setOpenDeleteDialogBox(false);
  };

  return (
    <>
      {deleteError && <p>{deleteError}</p>}
      {deleteSuccess && <p>story successfully deleted</p>}
      <div>{id}</div>
      <p>Confirm delete?</p>
      <button onClick={deleteStory} disabled={buttonDisabled}>
        yes
      </button>
      <button onClick={doNotDeleteStory} disabled={buttonDisabled}>
        no
      </button>
    </>
  );
};

export default DeleteStory;
