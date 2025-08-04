const axios = require('axios');

async function refreshSpotifyToken(refreshToken, clientId, clientSecret) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const response = await axios.post('https://accounts.spotify.com/api/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    }
  });
  return response.data.access_token;
}

module.exports = { refreshSpotifyToken };