const axios = require("axios");

const initiatePlaylsit = async (spotifyUserID, spotifyAccesToken) => {
    try {
        const response = await axios.post('https://api.spotify.com/v1/me/playlists', {
            name: "DailyTube Mix",
            description: "Your daily updated selected songs based off your YouTube music history!",
            public: true
        }, {
            headers: {
                Authorization: `Bearer ${spotifyAccesToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const playlistLink = response.data.external_urls.spotify;
        const playlistId = response.data.id;
        
        
        return [playlistLink, playlistId];
        
    } catch (error) {
        console.error("Error creating Spotify playlist:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = {initiatePlaylsit};