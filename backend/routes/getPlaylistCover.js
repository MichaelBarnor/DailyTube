const express = require('express');
const router = express.Router();
const {getPlaylistCover} = require("../services/findPlaylistCover")
const user = require("../models/user")
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, async (req, res) => {
    try{
    const currentUser = await user.findOne({ userId: req.user.userId, playlistId: { $ne: null } });
    
    const playlist = await getPlaylistCover(currentUser.spotifyAccessToken, currentUser.playlistId);
    res.json(playlist);
    }
    catch(error){
        console.log(error.stack)
    }
});

module.exports = router;