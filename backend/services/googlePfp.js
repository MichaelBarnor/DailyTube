const axios = require('axios');

/**
 * Fetches the user's first name and profile picture from Google using their OAuth access token.
 * @param {string} accessToken - The Google OAuth access token.
 * @returns {Promise<{ firstName: string, profilePic: string }>}
 */
async function getGoogleProfile(accessToken) {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { given_name, picture } = response.data;
    return {
      firstName: given_name || '',
      profilePic: picture || '',
    };
  } catch (error) {
    console.error('Error fetching Google profile:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getGoogleProfile };