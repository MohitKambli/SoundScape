// Assuming you're using Mongoose (MongoDB)
const mongoose = require('mongoose');

const songSchema  = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  preview_url: { type: String, required: true },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Song = mongoose.models.Song || mongoose.model('Song', songSchema );
module.exports = Song;