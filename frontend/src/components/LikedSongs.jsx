import React, { useEffect, useState } from 'react';
import './LikedSongs.css'; // Create a CSS file for styling

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      try {
        const response = await fetch(`${import.meta.env.VITE_SPOTIFY_API_URL}/liked-songs`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Log the fetched data for debugging
        setLikedSongs(data.likedSongs); // Ensure this is the correct path to your data
      } catch (err) {
        setError('Failed to fetch liked songs: ' + err.message);
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="liked-songs-container">
      <ul className="liked-songs-list">
        {likedSongs.length === 0 ? (
          <li>No liked songs available.</li>
        ) : (
          likedSongs.map((song, index) => (
            <li key={index} className="liked-song-item">
              <div className="liked-song-name">{song.name}</div>
              <div className="liked-song-artist">by {song.artist}</div>
              <div className="liked-song-album">Album: {song.album}</div>
              {song.preview_url && (
                <audio controls src={song.preview_url} className="liked-song-audio" />
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LikedSongs;
