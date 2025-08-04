const axios = require("axios");

const searchforSong = async (spotifyAccesToken, searchQuery) =>{
    try{
        const response = await axios.get("https://api.spotify.com/v1/search", {
            params:{
                q: searchQuery,
                type: "track",
                limit: 1

            },
            headers:{
                Authorization: `Bearer ${spotifyAccesToken}`,
                'Content-Type': 'application/json'
            }
            
        })
    const track = response.data.tracks.items[0];
    return track ? track.uri : null; 
    }

    catch(error){
        console.error("Error in da searching for song ")
        throw error
    }

}

module.exports = {searchforSong}