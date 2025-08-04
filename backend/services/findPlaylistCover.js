const axios = require('axios');

const getPlaylistCover  = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    const link = response.data[0]?.url || null;

  return link
  } catch (error) {
    console.error('Error fetching cover Spotify API:', error);
    throw error;
  }
};

module.exports = { getPlaylistCover };


  