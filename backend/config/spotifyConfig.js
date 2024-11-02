const axios = require('axios');
require('dotenv').config();

let accessToken = null;

// Function to get access token from Spotify
const getAccessToken = async () => {
  if (accessToken) {
    return accessToken; // Use cached token if it exists
  }
  
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;

    // Token expires in 1 hour; set a timeout to refresh it before it expires
    setTimeout(() => (accessToken = null), response.data.expires_in * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw new Error('Failed to get Spotify access token');
  }
};

module.exports = { getAccessToken };
