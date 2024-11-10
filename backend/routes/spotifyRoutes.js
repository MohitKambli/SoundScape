const express = require('express');
const { getAndSaveTrendingSongs, searchSongs } = require('../services/songService');
const router = express.Router();

// Route to get trending songs
router.get('/trending-songs', getAndSaveTrendingSongs);

// Route to search songs based on a query
router.get('/search', searchSongs);

module.exports = router;
