import React, { useState } from 'react';
import axios from 'axios';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');

  // Handle change in search term input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission to send search term to the backend
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the search term to the Flask backend via POST request
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
        search_term: searchTerm,
      });

      // Set the result received from the backend
      setResult(response.data.result);
    } catch (error) {
      console.error('Error occurred:', error);
      setResult('Error occurred while processing the search term.');
    }
  };

  return (
    <div>
      <h1>Search Term Processor</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter a search term"
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        <h3>Result:</h3>
        <p>{result}</p>
        {console.log(result)}
      </div>
    </div>
  );
}

export default SearchBar;
