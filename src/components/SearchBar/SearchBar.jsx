import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SearchBar = ({ setQuery }) => {
  const [currentQuery, setCurrentQuery] = useState('');

  const handelInputChange = eve => {
    setCurrentQuery(eve.target.value.trim());
  };

  const handleSubmit = eve => {
    eve.preventDefault();
    if (currentQuery.trim() !== '') {
      setQuery(currentQuery);
      setCurrentQuery('');
    } else {
      alert('Please enter a search query.');
    }
  };

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={handleSubmit}>
        <button type="submit" className="searchFormButton"></button>
        <input
          name="currentQuery"
          className="searchFormInput"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handelInputChange}
          value={currentQuery}
        />
      </form>
    </header>
  );
};
SearchBar.propTypes = {
  setQuery: PropTypes.func.isRequired,
};
