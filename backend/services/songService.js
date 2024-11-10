const TrendingSongs = require('../models/TrendingSongs');
const { fetchTrendingSongsFromSpotify } = require('../services/spotifyService');
const redisClient = require('../config/redisConfig');
const { fetchSongsBySearchTerm } = require('./spotifyService');
const User = require('../models/user');

// Controller to fetch and save trending songs to the database
const getAndSaveTrendingSongs = async (req, res) => {
  try {
    // Check if trending songs are cached in Redis
    const cachedSongs = await redisClient.get('trendingSongs');
    
    if (cachedSongs) {
      console.log('Fetching trending songs from Redis cache');
      return res.json({ trendingSongs: JSON.parse(cachedSongs) });
    }

    // If not in cache, fetch from Spotify
    console.log('Fetching trending songs from Spotify API');
    const trendingSongs = await fetchTrendingSongsFromSpotify();

    // Clear MongoDB collection and insert new trending songs
    await TrendingSongs.deleteMany();
    await TrendingSongs.insertMany(trendingSongs);

    // Cache the trending songs in Redis for 1 hour
    await redisClient.setEx('trendingSongs', 3600, JSON.stringify(trendingSongs)); // 3600 seconds = 1 hour

    res.json({ message: 'Trending songs fetched and cached successfully', trendingSongs });
  } catch (error) {
    console.error('Error saving trending songs:', error);
    res.status(500).json({ error: 'Failed to save trending songs' });
  }
};

// Controller to search for songs from Spotify API
const searchSongs = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`Searching for songs with query: ${query}`);

    // Fetch search results from Spotify API
    const searchResults = await fetchSongsBySearchTerm(query);

    res.json({ searchResults });
  } catch (error) {
    console.error('Error searching for songs:', error);
    res.status(500).json({ error: 'Failed to search for songs' });
  }
};

// Like a song (using MongoDB with Mongoose)
const likeSong = async (req, res) => {
  const { songName, artist, album, previewUrl } = req.body;
  const user = req.user; // User info from auth middleware

  try {
    // Verify that req.user contains _id
    if (!user || !user._id) {
      return res.status(400).json({ success: false, message: 'User information is missing' });
    }

    // Find the user in the DB
    const foundUser = await User.findById(user._id);

    if (!foundUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if song is already liked
    if (foundUser.likedSongs.some(song => song.previewUrl === previewUrl)) {
      return res.status(400).json({ success: false, message: 'Song already liked.' });
    }

    // Add the song to the likedSongs array
    foundUser.likedSongs.push({ name:songName, artist, album, preview_url:previewUrl });

    // Save the updated user
    await foundUser.save();

    res.status(200).json({ success: true, message: 'Song liked successfully.' });
  } catch (err) {
    console.error('Error while liking song:', err);
    res.status(500).json({ success: false, message: 'Failed to like song.' });
  }
};

// Like a song (using MongoDB with Mongoose)
const likedSongs = async (req, res) => {
  const user = req.user; // Get user info from the auth middleware

  try {
    // Check if user information is available
    if (!user || !user._id) {
      return res.status(400).json({ success: false, message: 'User information is missing' });
    }

    // Find the user in the database
    const foundUser = await User.findById(user._id);
    if (!foundUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the liked songs
    res.status(200).json({ success: true, likedSongs: foundUser.likedSongs });
  } catch (err) {
    console.error('Error fetching liked songs:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch liked songs.' });
  }
};


module.exports = { getAndSaveTrendingSongs, searchSongs, likeSong, likedSongs };
