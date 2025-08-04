const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URL,
      scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private'],
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("SPOTIFY LOGIN STRATEGY");
        console.log("Current user from session:", req.user);
    }
  
      // Get existing user data
      const existingUser = req.user || {};
      
      // Merge Spotify data with existing user
      const mergedUser = {
        ...existingUser,  // Keep all existing data (Google)
        spotifyId: profile.id,
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
        spotifyTokenExpiry: Date.now() + expires_in * 1000,
        lastProvider: 'spotify'
      };
      
       if (process.env.NODE_ENV !== 'production') {
        console.log("Merged user data:", mergedUser);
        console.log("Has Google token?", !!mergedUser.accessToken);
        console.log("Has Spotify token?", !!mergedUser.spotifyAccessToken);
       }
      
      return done(null, mergedUser);
    }
  )
);