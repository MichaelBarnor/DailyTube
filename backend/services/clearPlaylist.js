const axios = require("axios");

const emptyPlaylist = async (playlistId, spotifyAccesToken) => {
    try {
        const response = await axios.put(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: []    
        }, {
            headers: {
                Authorization: `Bearer ${spotifyAccesToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        return 
    } catch (error) {
        console.error("Error clearing Spotify playlist:", error.response?.data || error.message);
        if (process.env.NODE_ENV !== 'production') {
            console.log(error.stack);
        }
        throw new Error("Failed to clear Spotify playlist");
    }
};

module.exports = {emptyPlaylist};