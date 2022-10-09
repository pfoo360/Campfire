import React from "react";

const SearchBar = ({ setter }) => {
  const onChangeHandler = (e) => {
    e.preventDefault();
    console.log(e);
    setter(e.target.value);
  };
  return <input onChange={(e) => onChangeHandler(e)} />;
};

export default SearchBar;
