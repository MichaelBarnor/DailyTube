const express = require('express');
const router = express.Router();
const { getGoogleProfile } = require('../services/googlePfp');
const user = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const currentUser = await user.findOne({ userId: req.user.id });

    if (!currentUser || !currentUser.accessToken) {
      return res.status(401).json({ error: 'No Google access token found' });
    }
    
    const googleProfile = await getGoogleProfile(currentUser.accessToken);

    // Send Google profile info and playlistLink from MongoDB
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