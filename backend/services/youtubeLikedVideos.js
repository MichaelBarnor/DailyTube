const axios = require('axios');

const fetchYouTubeLikedVideos = async (accessToken) => {
  try {
    const response = await axios.get('https://youtube.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        maxResults: 30,
        myRating: 'like',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    throw error;
  }
};

module.exports = { fetchYouTubeLikedVideos };