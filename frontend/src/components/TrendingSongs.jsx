import React, { useEffect, useState } from 'react';

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
    <div>
      <h1>Trending Songs</h1>
      <ul>
        {songs.length === 0 ? (
          <li>No trending songs available.</li>
        ) : (
          songs.map((song, index) => (
            <li key={index}>
              <strong>{song.name}</strong> by {song.artist} <br />
              Album: {song.album} <br />
              {song.preview_url && <audio controls src={song.preview_url} />}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TrendingSongs;
