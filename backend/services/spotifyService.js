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

const fetchSongsBySearchTerm = async (query) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
    });

    // Extract relevant data from Spotify API response
    const songs = response.data.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
    }));

    return songs;
  } catch (error) {
    console.error('Error fetching songs from Spotify:', error);
    throw error;
  }
};

module.exports = { fetchTrendingSongsFromSpotify, fetchSongsBySearchTerm };
