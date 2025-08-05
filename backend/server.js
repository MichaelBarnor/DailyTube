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

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

mongoose.set('strictQuery', false);
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




 

// listens/starts server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('listening from port', PORT);
});
