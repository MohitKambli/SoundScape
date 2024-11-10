const express = require('express');
const router = express.Router();
const { likeSong } = require('../services/songService');
const authMiddleware = require('../middleware/authMiddleware');

// Route for liking a song
router.post('/user/like-song', authMiddleware, likeSong);

module.exports = router;