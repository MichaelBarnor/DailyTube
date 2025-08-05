require('dotenv').config();
const mongoose = require('mongoose');
const user = require('../models/user');
const { clearAndUpdatePlaylist } = require('./createPlaylist');
const { refreshSpotifyToken } = require('./refreshSpotifyToken');
const { refreshYouTubeToken } = require('./refreshGoogleToken');


(async () => {
  try {
    console.log("Script started");
    console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const users = await user.find({});
    for (const currentUser of users) {
      // Spotify refresh
      if (currentUser.spotifyRefreshToken) {
        try {
          const newSpotifyAccessToken = await refreshSpotifyToken(
            currentUser.spotifyRefreshToken,
            process.env.SPOTIFY_CLIENT_ID,
            process.env.SPOTIFY_CLIENT_SECRET
          );
          await user.updateOne(
            { userId: currentUser.userId },
            { $set: { spotifyAccessToken: newSpotifyAccessToken } }
          );
          currentUser.spotifyAccessToken = newSpotifyAccessToken;
        } catch (err) {
          console.error(`Spotify token refresh failed for user ${currentUser.userId}:`, err.message);
        }
      } else {
        console.error(`User ${currentUser.userId} is missing a Spotify refresh token.`);
      }

      // Google/YouTube refresh
      if (currentUser.youtubeRefreshToken) {
        try {
          const newYouTubeAccessToken = await refreshYouTubeToken(
            currentUser.youtubeRefreshToken,
            process.env.GOOGLE_ID,
            process.env.GOOGLE_SECRET
          );
          await user.updateOne(
            { userId: currentUser.userId },
            { $set: { accessToken: newYouTubeAccessToken } }
          );
          currentUser.accessToken = newYouTubeAccessToken;
        } catch (err) {
          console.error(`YouTube token refresh failed for user ${currentUser.userId}:`, err.message);
        }
      } else {
        console.error(`User ${currentUser.userId} is missing a YouTube refresh token.`);
      }

      // Always attempt playlist operations
      await clearAndUpdatePlaylist(currentUser);
      console.log(`Playlist cleared and updated for user ${currentUser.userId}`);
    }
  } catch (error) {
    console.error("Script failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
})();