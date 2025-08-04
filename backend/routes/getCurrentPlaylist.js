const express = require('express');
const router = express.Router();
const {getPlaylistItems} = require("../services/updatePlayListData")
const user = require("../models/user")
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, async (req, res) => {

    try{
    const currentUser = await user.findOne({ userId: req.user.userId, playlistId: { $ne: null } });

    const playlist = await getPlaylistItems(currentUser.spotifyAccessToken, currentUser.playlistId);
    res.json(playlist);
    }
    catch(error){
        console.log(error.stack)
    }
});

module.exports = router;