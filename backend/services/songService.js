const TrendingSongs = require('../models/Song');
const { fetchTrendingSongsFromSpotify } = require('../services/spotifyService');
const redisClient = require('../config/redisConfig');
const { fetchSongsBySearchTerm } = require('./spotifyService');

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

module.exports = { getAndSaveTrendingSongs, searchSongs };
