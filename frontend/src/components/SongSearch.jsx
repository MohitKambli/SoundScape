import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './SongSearch.css';

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await fetch(`${import.meta.env.VITE_SPOTIFY_API_URL}/search?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      
      if (!response.ok) throw new Error('Error fetching search results');
      
      const data = await response.json();
      setSearchResults(data.searchResults);
      setError(null);
    } catch (err) {
      setError('Failed to search songs: ' + err.message);
      setSearchResults([]);
    }
  };

  return (
    <div className="song-search-container">
      <div className="song-search-bar">
        <input
          type="text"
          placeholder="Enter song name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="song-search-input"
        />
        <button onClick={handleSearch} className="song-search-button">Search</button>
      </div>

      {error && <p>{error}</p>}
      <ul className="song-search-results">
        {searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          searchResults.map((song, index) => (
            <li key={index} className="song-search-item">
              <div className="song-search-name">{song.name}</div>
              <div className="song-search-artist">by {song.artist}</div>
              <div className="song-search-album">Album: {song.album}</div>
              {song.preview_url && (
                <audio controls src={song.preview_url} className="song-search-audio" />
              )}
              <FontAwesomeIcon icon={faHeart} className="like-button" />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SongSearch;