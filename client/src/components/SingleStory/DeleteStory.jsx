import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DeleteStoryCSS from "./DeleteStory.module.css";

const DeleteStory = ({
  id,
  setOpenDeleteDialogBox,
  setIsDeleteAndEditButtonDisabled,
}) => {
  const DELETE_URL = "/api/v1/story/";
  const axiosPrivate = useAxiosPrivate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { setAuth } = useAuth();

  const deleteStory = async () => {
    setDeleteSuccess(false);
    setDeleteError("");
    try {
      setButtonDisabled(true);
      setIsDeleteAndEditButtonDisabled(true);
      const response = await axiosPrivate.delete(`${DELETE_URL}${id}`);
      setDeleteSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      //403= forbidden bc access token not valid/expired
      //403=story found in db but does not match with userinfo sent by user
      //404 not found in db
      //401=unauthorized bc refresh token also expried
      if (!error?.response) {
        setDeleteError("No server response");
      } else if (error.response?.status === 401) {
        setDeleteError("Unauthorized");
        setAuth({});
        setTimeout(() => {
          navigate("/login", { state: { from: location }, replace: true });
        }, 1000);
      } else if (error.response?.status === 403) {
        setDeleteError("Forbidden");
      } else if (error.response?.status === 404) {
        setDeleteError("Story not found");
      } else {
        setDeleteError("Delete failed");
      }
      setButtonDisabled(false);
      setIsDeleteAndEditButtonDisabled(false);
      //setOpenDeleteDialogBox(false);
    }
  };

  const doNotDeleteStory = () => {
    setOpenDeleteDialogBox(false);
  };

  return (
    <div className={DeleteStoryCSS.Container}>
      {deleteError && (
        <p
          className={`${DeleteStoryCSS.Delete_paragraph} ${DeleteStoryCSS.Delete_paragraph__error}`}
        >
          {deleteError}
        </p>
      )}
      {deleteSuccess && (
        <p
          className={`${DeleteStoryCSS.Delete_paragraph} ${DeleteStoryCSS.Delete_paragraph__success}`}
        >
          story successfully deleted
        </p>
      )}
      <p className={DeleteStoryCSS.Delete_paragraph}>Deleting story {id}</p>
      <p className={DeleteStoryCSS.Delete_paragraph}>Confirm delete?</p>
      <div>
        <button
          onClick={deleteStory}
          disabled={buttonDisabled}
          className={`${DeleteStoryCSS.Delete_button} ${
            DeleteStoryCSS.Delete_button__yes
          } ${buttonDisabled ? DeleteStoryCSS.Delete_button__yesDisabled : ""}`}
        >
          delete
        </button>
        <button
          onClick={doNotDeleteStory}
          disabled={buttonDisabled}
          className={`${DeleteStoryCSS.Delete_button} ${
            DeleteStoryCSS.Delete_button__no
          } ${buttonDisabled ? DeleteStoryCSS.Delete_button__noDisabled : ""}`}
        >
          no
        </button>
      </div>
    </div>
  );
};

export default DeleteStory;
