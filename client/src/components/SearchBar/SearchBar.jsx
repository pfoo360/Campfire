import React from "react";
import SearchBarCSS from "./SearchBar.module.css";

const SearchBar = ({ setQuery, query, setPageNumber }) => {
  const onChangeHandler = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    setPageNumber(1);
  };
  return (
    <div className={SearchBarCSS.Container}>
      <input
        type="text"
        value={query}
        onChange={onChangeHandler}
        placeholder={"find title or story..."}
        className={SearchBarCSS.SearchBar_input}
      />
    </div>
  );
};

export default SearchBar;
