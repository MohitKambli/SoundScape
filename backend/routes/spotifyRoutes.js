const express = require('express');
const { getAndSaveTrendingSongs } = require('../services/songService');

const router = express.Router();

// Route to get trending songs
router.get('/trending-songs', getAndSaveTrendingSongs);

module.exports = router;
