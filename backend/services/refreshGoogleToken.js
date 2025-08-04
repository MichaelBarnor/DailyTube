const axios = require('axios');

async function refreshYouTubeToken(refreshToken, clientId, clientSecret) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  const response = await axios.post('https://oauth2.googleapis.com/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data.access_token;
}

module.exports = { refreshYouTubeToken };