const mongoose = require('mongoose');

const trendingSongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  preview_url: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrendingSongs', trendingSongSchema);
