const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

if (process.env.NODE_ENV !== 'production') {
  console.log('Google OAuth Config Check:');
  console.log('GOOGLE_ID exists:', !!process.env.GOOGLE_ID);
  console.log('GOOGLE_SECRET exists:', !!process.env.GOOGLE_SECRET);
  console.log('GOOGLE_REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URL,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
  accessType: 'offline',      // <-- Always request refresh token
  prompt: 'consent'
}, async (accessToken, refreshToken, profile, done) => {
      console.log("Google refreshToken received:", refreshToken);
      console.log("GOOGLE LOGIN STRATEGY");
      console.log("Access token received:", !!accessToken);
      console.log("Profile ID:", profile.id);
  // if (process.env.NODE_ENV !== 'production') { // CHNAGE THIS BACK to !===
 
  //   }

  const user = {
    id: profile.id,
    accessToken: accessToken,
    youtubeRefreshToken: refreshToken,
    displayName: profile.displayName,
    email: profile.emails?.[0]?.value,
    provider: 'google',
    tokenExpiry: Date.now() + (3600 * 1000) // 1 hour
  };
  
  console.log("✅ Google user created:", user);
  return done(null, user);
}));

// serialize gets called when a user logs in and saves whatever the function specifies to the session.
//  Then, deserialize is called whenever a user makes a request—it retrieves the information that was stored in the session by serialize

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
