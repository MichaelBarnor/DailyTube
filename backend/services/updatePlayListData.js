const axios = require('axios');

const getPlaylistItems  = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    const items = response.data.items;
    

 function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

      const result = items.map(item => {
      const track = item.track;
      return {
        title: track.name,
        album: track.album.name,
        artist: track.artists.map(a => a.name).join(', '),
        duration: formatDuration(track.duration_ms),
        albumCover: track.album.images[0]?.url
      };
    });

    
  return result
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    throw error;
  }
};

module.exports = { getPlaylistItems };


  