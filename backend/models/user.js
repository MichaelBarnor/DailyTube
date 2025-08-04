const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String, 
  spotifyId: String,
  playlistId: String,
  playlistLink: String,
  accessToken: String,
  youtubeRefreshToken: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String 
});

module.exports = mongoose.model('user', userSchema);