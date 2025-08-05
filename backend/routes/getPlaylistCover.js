const express = require('express');
const router = express.Router();
const { getPlaylistCover } = require("../services/findPlaylistCover");
const user = require("../models/user");
const authenticateJWT = require('../middleware/auth');
const { refreshSpotifyToken } = require('../services/refreshSpotifyToken');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await user.findOne({ userId: req.user.userId, playlistId: { $ne: null } });

    let playlist;
    try {
      playlist = await getPlaylistCover(currentUser.spotifyAccessToken, currentUser.playlistId);
    } catch (err) {
      if (err.response && err.response.status === 401 && currentUser.spotifyRefreshToken) {
        console.log("Refreshing Spotify token for user:", currentUser.userId);
        console.log("Refresh token:", currentUser.spotifyRefreshToken);
        try {
          const newSpotifyAccessToken = await refreshSpotifyToken(
            currentUser.spotifyRefreshToken,
            process.env.SPOTIFY_ID,
            process.env.SPOTIFY_SECRET
          );
          await user.updateOne(
            { userId: currentUser.userId },
            { $set: { spotifyAccessToken: newSpotifyAccessToken } }
          );
          playlist = await getPlaylistCover(newSpotifyAccessToken, currentUser.playlistId);
        } catch (refreshErr) {
          console.error("Spotify token refresh failed:", refreshErr.response?.data || refreshErr.message);
          return res.status(401).json({ error: "Spotify authentication failed. Please reconnect your account." });
        }
      } else {
        throw err;
      }
    }

    res.json(playlist);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Failed to fetch playlist cover" });
  }
});

module.exports = router;