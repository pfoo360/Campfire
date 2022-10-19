import React from "react";

const SearchBar = ({ setQuery, query, setPageNumber }) => {
  const onChangeHandler = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    setPageNumber(1);
  };
  return <input type="text" value={query} onChange={onChangeHandler} />;
};

export default SearchBar;
