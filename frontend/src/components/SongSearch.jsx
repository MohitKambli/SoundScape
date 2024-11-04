// src/components/SongSearch.jsx
import React, { useState } from 'react';

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      // Replace with actual API request to fetch songs based on search query
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search?q=${query}`);
      
      if (!response.ok) throw new Error('Error fetching search results');
      
      const data = await response.json();
      setSearchResults(data.tracks || []);
      setError(null);
    } catch (err) {
      setError('Failed to search songs: ' + err.message);
      setSearchResults([]);
    }
  };

  return (
    <div>
      <h2>Search A Song</h2>
      <input 
        type="text" 
        placeholder="Enter song name..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}
      <ul>
        {searchResults.length === 0 ? <p>No results found.</p> : searchResults.map((song, index) => (
          <li key={index}>
            <strong>{song.name}</strong> by {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongSearch;
