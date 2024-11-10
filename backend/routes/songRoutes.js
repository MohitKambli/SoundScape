const express = require('express');
const router = express.Router();
const { likeSong, likedSongs } = require('../services/songService');
const authMiddleware = require('../middleware/authMiddleware');

// Route for liking a song
router.post('/user/like-song', authMiddleware, likeSong);

// Route for fetching liked songs
router.get('/user/liked-songs', authMiddleware, likedSongs);

module.exports = router;