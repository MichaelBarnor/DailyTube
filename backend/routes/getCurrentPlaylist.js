const express = require('express');
const router = express.Router();
const { getPlaylistItems } = require("../services/updatePlayListData");
const user = require("../models/user");
const authenticateJWT = require('../middleware/auth');
const { refreshSpotifyToken } = require('../services/refreshSpotifyToken');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const currentUser = await user.findOne({ userId: req.user.userId, playlistId: { $ne: null } });

    let playlist;
    try {
      playlist = await getPlaylistItems(currentUser.spotifyAccessToken, currentUser.playlistId);
    } catch (err) {
      // If token expired, refresh and retry
      if (err.response && err.response.status === 401 && currentUser.spotifyRefreshToken) {
        const newSpotifyAccessToken = await refreshSpotifyToken(
          currentUser.spotifyRefreshToken,
          process.env.SPOTIFY_CLIENT_ID,
          process.env.SPOTIFY_CLIENT_SECRET
        );
        await user.updateOne(
          { userId: currentUser.userId },
          { $set: { spotifyAccessToken: newSpotifyAccessToken } }
        );
        playlist = await getPlaylistItems(newSpotifyAccessToken, currentUser.playlistId);
      } else {
        throw err;
      }
    }

    res.json(playlist);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

module.exports = router;