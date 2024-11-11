const TrendingSongs = require('../models/TrendingSongs');
const { fetchTrendingSongsFromSpotify } = require('../services/spotifyService');
const redisClient = require('../config/redisConfig');
const { fetchSongsBySearchTerm } = require('./spotifyService');
const User = require('../models/user');
const Song = require('../models/Song');

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

// Cache liked songs in Redis for a specific user
const cacheLikedSongs = async (userId, likedSongs) => {
  try {
    await redisClient.setEx(`likedSongs:${userId}`, 3600, JSON.stringify(likedSongs)); // Cache for 1 hour
    console.log('Liked songs cached in Redis');
  } catch (error) {
    console.error('Error caching liked songs in Redis:', error);
  }
};

// Fetch liked songs from Redis cache
const getLikedSongsFromCache = async (userId) => {
  try {
    const cachedLikedSongs = await redisClient.get(`likedSongs:${userId}`);
    if (cachedLikedSongs) {
      console.log('Fetching liked songs from Redis cache');
      return JSON.parse(cachedLikedSongs);
    }
    return null;
  } catch (error) {
    console.error('Error fetching liked songs from Redis:', error);
    return null;
  }
};

// Like/Unlike a song (using MongoDB with Mongoose and caching in Redis)
const likeSong = async (req, res) => {
  const { songName, artist, album, previewUrl, liked } = req.body;
  const user = req.user; // User info from auth middleware

  try {
    if (!user || !user._id) {
      return res.status(400).json({ success: false, message: 'User information is missing' });
    }

    // Find the song by preview URL or create it if it doesn’t exist
    let song = await Song.findOne({ preview_url: previewUrl });
    if (!song) {
      song = new Song({ name: songName, artist, album, preview_url: previewUrl });
    }

    // Add or remove the user ID in the likedBy array
    if (liked) {
      if (!song.likedBy.includes(user._id)) {
        song.likedBy.push(user._id); // Add user to likedBy array
      }
    } else {
      song.likedBy = song.likedBy.filter(id => id.toString() !== user._id.toString()); // Remove user from likedBy array
    }

    await song.save();

    // Update Redis cache for the user's liked songs
    const likedSongs = await Song.find({ likedBy: user._id }); // Get updated liked songs for the user
    await cacheLikedSongs(user._id, likedSongs);

    res.status(200).json({ success: true, message: liked ? 'Song liked successfully.' : 'Song unliked successfully.' });
  } catch (err) {
    console.error('Error while liking/unliking song:', err);
    res.status(500).json({ success: false, message: 'Failed to like/unlike song.' });
  }
};

// Fetch liked songs (using Redis cache first, then fallback to MongoDB if needed)
const likedSongs = async (req, res) => {
  const user = req.user;

  try {
    if (!user || !user._id) {
      return res.status(400).json({ success: false, message: 'User information is missing' });
    }

    // Check if liked songs are cached in Redis
    let likedSongs = await getLikedSongsFromCache(user._id);

    if (!likedSongs) {
      // If not in cache, retrieve from MongoDB
      console.log('Fetching liked songs from MongoDB');
      likedSongs = await Song.find({ likedBy: user._id }); // Fetch songs liked by the user

      // Cache the liked songs in Redis
      await cacheLikedSongs(user._id, likedSongs);
    }

    res.status(200).json({ success: true, likedSongs });
  } catch (err) {
    console.error('Error fetching liked songs:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch liked songs.' });
  }
};


module.exports = { getAndSaveTrendingSongs, searchSongs, likeSong, likedSongs };
