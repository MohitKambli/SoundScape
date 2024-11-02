const axios = require('axios');
const { getAccessToken } = require('../config/spotifyConfig');

const fetchTrendingSongsFromSpotify = async () => {
  const token = await getAccessToken();
  
  // Fetch featured playlists
  const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const playlists = response.data.playlists.items;
  let allTracks = [];

  for (const playlist of playlists) {
    const playlistId = playlist.id;
    const trackResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tracks = trackResponse.data.items
      .filter(item => item.track.preview_url)
      .map(item => ({
        name: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        album: item.track.album.name,
        preview_url: item.track.preview_url,
      }));

    allTracks = allTracks.concat(tracks);
    if (allTracks.length >= 30) break;
  }

  return allTracks.slice(0, 30);
};

module.exports = { fetchTrendingSongsFromSpotify };
