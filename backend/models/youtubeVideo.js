const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  title: String,
  channelTitle: String,
  thumbnail: String,
  publishedAt: Date,
  isMusic: {
    type: Boolean,
    default: null
  },
  trackUri:{
    type: String,
    default: null 
  }, 
  lastFetched: {
    type: Date,
    default: Date.now
  },
  metadata: {
    description: String,
    duration: String,
    tags: [String]
  }
});

youtubeVideoSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('youtubeVideo', youtubeVideoSchema);