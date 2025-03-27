import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [options, setOptions] = useState([]);

  // Fetch all movies for options when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/movies');
        const movieOptions = response.data.movies.map(movie => ({
          value: movie,
          label: movie
        }));
        setOptions(movieOptions);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleSearchChange = (selectedOption) => {
    setSearchTerm(selectedOption ? selectedOption.value : '');
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
        search_term: searchTerm,
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error occurred:', error);
      setResults([]);
    }
  };

  return (
    <div>
      <h1>Movie Recommendations</h1>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ width: '300px', marginBottom: '10px' }}>
          <Select
            options={options}
            onChange={handleSearchChange}
            placeholder="Enter a movie name"
            isClearable
            isSearchable
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Get Recommendations
        </button>
      </form>

      <div>
        <h3>Recommended Movies:</h3>
        {results.length > 0 ? (
          <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {results.map((movie, index) => (
              <li key={index} style={{ width: '200px' }}>
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '300px', 
                    backgroundColor: '#ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    No Image Available
                  </div>
                )}
                <p>{movie.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations yet</p>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
