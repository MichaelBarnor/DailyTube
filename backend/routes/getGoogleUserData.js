const express = require('express');
const router = express.Router();
const { getGoogleProfile } = require('../services/googlePfp');
const user = require('../models/user');
const { refreshYouTubeToken } = require('../services/refreshGoogleToken');


router.get('/', async (req, res) => {
  try {
    const currentUser = await user.findOne({ userId: req.user.id });

    if (!currentUser || !currentUser.accessToken) {
      return res.status(401).json({ error: 'No Google access token found' });
    }

    let googleProfile;
    try {
      googleProfile = await getGoogleProfile(currentUser.accessToken);
    } catch (err) {
      // If token expired, refresh and retry
      if (err.response && err.response.status === 401 && currentUser.youtubeRefreshToken) {
        const newAccessToken = await refreshYouTubeToken(
          currentUser.youtubeRefreshToken,
          process.env.GOOGLE_ID,
          process.env.GOOGLE_SECRET
        );
        await user.updateOne(
          { userId: currentUser.userId },
          { $set: { accessToken: newAccessToken } }
        );
        googleProfile = await getGoogleProfile(newAccessToken);
      } else {
        throw err;
      }
    }

    res.json({
      firstName: googleProfile.firstName,
      profilePic: googleProfile.profilePic,
      playlistLink: currentUser.playlistLink || null
    });
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    res.status(500).json({ error: 'Failed to fetch Google user data' });
  }
});

module.exports = router;