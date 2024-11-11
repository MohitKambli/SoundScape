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
    const fetchSongsAndLikedSongs = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      try {
        // Fetch trending songs
        const songsResponse = await fetch(`${import.meta.env.VITE_SPOTIFY_API_URL}/trending-songs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!songsResponse.ok) {
          throw new Error('Failed to fetch trending songs');
        }

        const songsData = await songsResponse.json();
        setSongs(songsData.trendingSongs);

        // Fetch user's liked songs
        const likedSongsResponse = await fetch(`${import.meta.env.VITE_SONG_API_URL}/user/liked-songs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!likedSongsResponse.ok) {
          throw new Error('Failed to fetch liked songs');
        }

        const likedSongsData = await likedSongsResponse.json();
        // Assume likedSongsData is an array of preview URLs of liked songs
        setLikedSongs(new Set(likedSongsData.likedSongs.map(song => song.preview_url)));
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsAndLikedSongs();
  }, []);

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
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
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
