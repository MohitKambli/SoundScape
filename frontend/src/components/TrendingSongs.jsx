import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './TrendingSongs.css';

const TrendingSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedSongs, setLikedSongs] = useState(new Set());

  useEffect(() => {
    const fetchSongs = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      console.log(token);
      try {
        const response = await fetch(`${import.meta.env.VITE_SPOTIFY_API_URL}/trending-songs`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Log the fetched data for debugging
        setSongs(data.trendingSongs); // Ensure this is the correct path to your data
      } catch (err) {
        setError('Failed to fetch trending songs: ' + err.message);
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleLike = async (song) => {
    // Toggle the liked state locally
    setLikedSongs((prev) => {
      const newLikedSongs = new Set(prev);
      if (newLikedSongs.has(song.preview_url)) {
        newLikedSongs.delete(song.preview_url);
      } else {
        newLikedSongs.add(song.preview_url);
      }
      return newLikedSongs;
    });

    // Make a backend call to update the user's liked songs with the full song details
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="trending-songs-container">
      <ul className="trending-songs-list">
        {songs.length === 0 ? (
          <li>No trending songs available.</li>
        ) : (
          songs.map((song, index) => (
            <li key={index} className="trending-song-item">
              <div className="trending-song-name">{song.name}</div>
              <div className="trending-song-artist">by {song.artist}</div>
              <div className="trending-song-album">Album: {song.album}</div>
              {song.preview_url && (
                <audio controls src={song.preview_url} className="trending-song-audio" />
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

export default TrendingSongs;
