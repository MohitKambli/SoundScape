import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './SongSearch.css';

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [likedSongs, setLikedSongs] = useState(new Set());

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

  const handleLike = async (song) => {
    // Toggle the liked state locally
    setLikedSongs((prev) => {
      const newLikedSongs = new Set(prev);
      if (newLikedSongs.has(song.name)) {
        newLikedSongs.delete(song.name);
      } else {
        newLikedSongs.add(song.name);
      }
      return newLikedSongs;
    });
  
    // Make a backend call to update the user's liked songs
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await fetch(`${import.meta.env.VITE_SONG_API_URL}/user/like-song`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songName: song.name,   // Include song name
          artist: song.artist,   // Include artist name
          album: song.album,     // Include album name
          previewUrl: song.preview_url,  // Include preview URL
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update liked song');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to update liked song');
      }
      console.log('Song liked successfully');
    } catch (err) {
      console.error('Error while liking the song:', err.message);
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
              <FontAwesomeIcon
                icon={faHeart}
                className={`like-button ${likedSongs.has(song.name) ? 'liked' : ''}`}
                onClick={() => handleLike(song)} // Pass the full song object
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SongSearch;
