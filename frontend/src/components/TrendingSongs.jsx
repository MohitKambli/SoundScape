import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './TrendingSongs.css';

const TrendingSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/trending-songs`);

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
              <FontAwesomeIcon icon={faHeart} className="like-button" />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TrendingSongs;
