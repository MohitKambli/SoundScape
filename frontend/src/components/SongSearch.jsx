import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './SongSearch.css';

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [likedSongs, setLikedSongs] = useState(new Set());

  // Fetch liked songs when component mounts
  useEffect(() => {
    const fetchLikedSongs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_SONG_API_URL}/user/liked-songs`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        
        if (!response.ok) throw new Error('Error fetching liked songs');
        
        const data = await response.json();
        // Populate likedSongs set
        const likedSongsSet = new Set(data.likedSongs.map(song => song.preview_url));
        setLikedSongs(likedSongsSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch liked songs: ' + err.message);
      }
    };

    fetchLikedSongs();
  }, []); // Runs once when the component mounts

  const handleSearch = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_SPOTIFY_API_URL}/search?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
    const isLiked = likedSongs.has(song.preview_url);
    const updatedLikedSongs = new Set(likedSongs);

    if (isLiked) {
      updatedLikedSongs.delete(song.preview_url);
    } else {
      updatedLikedSongs.add(song.preview_url);
    }
    setLikedSongs(updatedLikedSongs);

    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_SONG_API_URL}/user/like-song`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songName: song.name,
          artist: song.artist,
          album: song.album,
          previewUrl: song.preview_url,
          liked: !isLiked,  // Send `liked` flag to indicate the action (like/unlike)
        }),
      });
    } catch (err) {
      console.error('Error updating like status:', err.message);
      // Revert the state update in case of an error
      setLikedSongs(isLiked ? updatedLikedSongs.add(song.preview_url) : updatedLikedSongs.delete(song.preview_url));
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
                className={`like-button ${likedSongs.has(song.preview_url) ? 'liked' : ''}`}
                onClick={() => handleLike(song)}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SongSearch;
