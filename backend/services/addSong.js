const axios = require("axios")
const addSongtoPlaylsit = async(playlistId, trackUris, spotifyAccesToken) =>{

    try{
        console.log("Sending these URIs to Spotify:", trackUris);
        const response = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
                uris: trackUris, // should be a comma seperarted string
        },
        {
            headers :{
                Authorization: `Bearer ${spotifyAccesToken}`,
                'Content-Type': 'application/json'
            }
        })     
        return  response.data
    }
    catch(error){
        console.error("Issues with adding songs to playlsit");
        if (error.response) {
            console.error("Spotify error response:", error.response.data);
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log(error.stack);
        }
        throw new Error("Failed to add songs to playlist");
    }
    } 

    module.exports = {addSongtoPlaylsit}
