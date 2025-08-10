const express = require('express');
const router = express.Router();
const passport = require('passport')
const {buildPlaylistForUser} =  require('../services/createPlaylist')
const user = require("../models/user")
const jwt = require("jsonwebtoken")

// Initial auth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'], // ADDED THIS STUFF
  accessType: 'offline',
  // prompt: 'consent'
}));
router.get('/spotify', passport.authenticate('spotify'));

// Simple callbacks - let strategies handle the merging
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/'
}), async (req, res) => {
  await user.updateOne(
    { userId: req.user.id },
    { $set: { userId: 
      req.user.id,
      accessToken: req.user.accessToken,
      youtubeRefreshToken: req.user.youtubeRefreshToken } },
    { upsert: true }
    );
    const currentUser = await user.findOne({ userId: req.user.id });

    const accesTokenPayload = {
      userId: currentUser.userId
    }

    const accessToken = jwt.sign(accesTokenPayload, process.env.JWT_SECRET, {expiresIn: "15m"});
    const refreshToken = jwt.sign(accesTokenPayload, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

router.get('/spotify/redirect', passport.authenticate('spotify', {
    failureRedirect: '/' 
}), async(req, res) => {
  try{
    await user.updateOne(
      {userId: req.user.id },
      { $set: {spotifyId:
          req.user.spotifyId,
          spotifyAccessToken:req.user.spotifyAccessToken,
          spotifyRefreshToken: req.user.spotifyRefreshToken }}
    );

    const currentUser = await user.findOne({ userId: req.user.id });

    const accesTokenPayload = {
      userId: currentUser.userId,
      spotifyId: currentUser.spotifyId
    }

    const accessToken = jwt.sign(accesTokenPayload, process.env.JWT_SECRET, {expiresIn: "15m"});
    const refreshToken = jwt.sign(accesTokenPayload, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    //process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const result = await buildPlaylistForUser(currentUser);
    
    if (result && result.error === "NO_MUSIC_VIDEOS") {
      // Redirect without playlist_created param
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?no_music=true`);
    }
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?playlist_created=true`);
  }
  catch(error){
    res.redirect('/dashboard?error=playlist_failed`');
  }
  
});


router.get('/access-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId, spotifyId: payload.spotifyId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true, // or true in production
    sameSite: 'strict'
  });
  if (req.logout) {
    req.logout(function(err) {
      if (err) { 
        console.error('Logout error:', err);
        if (process.env.NODE_ENV !== 'production') {
          console.error(err.stack);
        }
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out' });
    });
  } else {
    res.json({ message: 'Logged out' });
  }
});



module.exports = router;