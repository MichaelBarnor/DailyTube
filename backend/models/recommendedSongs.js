const mongoose = require('mongoose');

const recSongSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  trackUri:{
    type: String,
    default: null 
  }, 
  lastFetched: {
    type: Date,
    default: Date.now
  },
  
});

recSongSchema.index({ userId: 1, trackUri: 1 }, { unique: true });

module.exports = mongoose.model('recSongCollection', recSongSchema);