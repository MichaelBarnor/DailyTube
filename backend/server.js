require('dotenv').config()
require('./strategies/google')
require('./strategies/spotify')

const passport = require('passport')
const express =  require('express')
const session = require("express-session")
const path = require('path');
const app =  express()
app.use(express.json());
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth')
const currentPlaylist = require("./routes/getCurrentPlaylist")
const currentCover =  require("./routes/getPlaylistCover")
const getGoogleUserData = require('./routes/getGoogleUserData');
const mongoose = require('mongoose')
const cron = require('node-cron');
const { clearAndUpdatePlaylist } = require('./services/createPlaylist');
const { refreshSpotifyToken } = require('./services/refreshSpotifyToken');
const { refreshYouTubeToken } = require('./services/refreshGoogleToken');


const user = require('./models/user')
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

app.use(session({
    secret: "dailtube-secert-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
} 
));

app.use(passport.initialize());
app.use(passport.session())                                                                       


// logs reqs
app.use((req,res,next) =>{
    console.log(req.path,req.method)
    next()
});

// route handler
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/playlist/current', currentPlaylist);
app.use('/api/playlist/cover', currentCover);
app.use('/api/user/me', getGoogleUserData);


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


cron.schedule('0 3 * * *', async () => {
  console.log("Cron job started at", new Date().toLocaleString());
  try {
    const users = await user.find({});
    for (const currentUser of users) {
      // Spotify refresh
      if (currentUser.spotifyRefreshToken) {
        try {
          const newSpotifyAccessToken = await refreshSpotifyToken(
            currentUser.spotifyRefreshToken,
            process.env.SPOTIFY_CLIENT_ID,
            process.env.SPOTIFY_CLIENT_SECRET
          );
          await user.updateOne(
            { userId: currentUser.userId },
            { $set: { spotifyAccessToken: newSpotifyAccessToken } }
          );
          currentUser.spotifyAccessToken = newSpotifyAccessToken;
        } catch (err) {
          console.error(`Spotify token refresh failed for user ${currentUser.userId}:`, err.message);
          // Don't continue; just log the error
        }
      } else {
        console.error(`User ${currentUser.userId} is missing a Spotify refresh token.`);
        // Don't continue; just log the error
      }

      // Google/YouTube refresh
      if (currentUser.youtubeRefreshToken) {
        try {
          const newYouTubeAccessToken = await refreshYouTubeToken(
            currentUser.youtubeRefreshToken,
            process.env.GOOGLE_ID,
            process.env.GOOGLE_SECRET
          );
          await user.updateOne(
            { userId: currentUser.userId },
            { $set: { accessToken: newYouTubeAccessToken } }
          );
          currentUser.accessToken = newYouTubeAccessToken;
        } catch (err) {
          console.error(`YouTube token refresh failed for user ${currentUser.userId}:`, err.message);
          // Don't continue; just log the error
        }
      } else {
        console.error(`User ${currentUser.userId} is missing a YouTube refresh token.`);
        // Don't continue; just log the error
      }

      // Always attempt playlist operations
      await clearAndUpdatePlaylist(currentUser);
      console.log(`Playlist cleared and updated for user ${currentUser.userId}`);
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});

 

// listens/starts server
app.listen(4000,"127.0.0.1", () => {
    console.log('listening from port', process.env.PORT)
} );
