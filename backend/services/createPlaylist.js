const { fetchYouTubeLikedVideos } = require("./youtubeLikedVideos");
const youtubeVideo =  require("../models/youtubeVideo");
const recSongCollection = require("../models/recommendedSongs")
const user = require("../models/user")
const {initiatePlaylsit} = require("./initPlaylist")
const {addSongtoPlaylsit} = require("./addSong")
const {emptyPlaylist} =  require("./clearPlaylist")
const Groq = require("groq-sdk");
const { searchforSong } = require("./searchSong");
const groq = new Groq();



/**
 * Fetches liked videos from YouTube and saves them to MongoDB for a user.
 * @param {string} userId - User's ID
 * @param {string} accessToken - YouTube access token
 * @returns {Promise<Array>} Array of saved video objects
 */
const saveLikedVideos = async(userId, accessToken) =>{// call userliked videos route and saved the liked videos into mongoDB

    try {
    const videos = await fetchYouTubeLikedVideos(accessToken);
  
    if (!videos || videos.length === 0) {
      return [];
    }
    
    // Process videos for MongoDB, the output of this is a new array of objects
    const processedVideos = videos.map(video => ({
      userId: userId,
      videoId: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
      publishedAt: new Date(video.snippet.publishedAt),
      lastFetched: new Date(),
      metadata: {
        description: video.snippet.description || '',
        duration: video.contentDetails?.duration || '',
        tags: video.snippet.tags || []
      }
    }));
    
    // clear old videos for this user to avoid duplicates
    await youtubeVideo.deleteMany({ userId: userId });
    
    const savedVideos = await youtubeVideo.insertMany(processedVideos);
    
    
    return savedVideos;
    
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('YouTube API 403: User has no liked videos or token is invalid.');
      return [];
    }
    console.error('Error saving liked videos:', error);
    throw error;
  }
};

/**
 * Retrieves all liked videos for a user from MongoDB.
 * @param {string} userId - User's ID
 * @returns {Promise<Array>} Array of video objects
 */
const getLikedVideos = async (userId) => {

  try{
     const likedVideos = await youtubeVideo.find({userId: userId});
     return likedVideos; 
  }

  catch(error){
    console.log({"error with getting liked videos": error }); 
    throw error;
  }

}

/**
 * Filters liked videos to classify which are music using Groq, updates DB, and returns music videos.
 * @param {string} userID - User's ID
 * @returns {Promise<Object>} Object: { total, musicCount, musicVideos }
 */
const filerLikedVideos = async (userID) => {

try{
  const likedVideos =  await getLikedVideos(userID);

  if(!likedVideos || likedVideos.length === 0){ // check if null, undefined, false, and if databse is just empty or not
    return{ message: "No liked videos found", musicVideos: [] }
  }

  const videoData =  likedVideos.map(video => ({// get spefic data from videos, .map creates a new array of obejcts from likedvideos which is already an array of liked videos, where each liked video in an object
    title: video.title,
    channelTitle: video.channelTitle,
    tags: video.metadata.tags.slice(0,5) || []
  }))


  const prompt =
      `Classify these YouTube videos as MUSIC or NOT_MUSIC.

      MUSIC includes: official music videos, live performances, concerts, music tutorials, DJ sets, covers, music reviews, regular songs
      NOT_MUSIC includes: gaming, vlogs, podcasts, movies, commercials, general entertainment

      Respond with only "MUSIC" or "NOT_MUSIC" for each video, one per line.

      Videos:
      ${videoData.map((video, index) => 
        `${index + 1}. "${video.title}" by ${video.channelTitle}`
      ).join('\n')}

      Response format example:
      MUSIC
      NOT_MUSIC
      MUSIC

      Classifications:`;

  const completion = await groq.chat.completions.create({
     messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.1,
      max_tokens: 200
  })

    const classifications = completion.choices[0].message.content 
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0) 
      .map(line => {
        if (line.includes('MUSIC') || line.includes('NOT_MUSIC')) {
          // Extract just the classification part
          if (line.includes('MUSIC') && !line.includes('NOT_MUSIC')) {
            return 'MUSIC';
          } else if (line.includes('NOT_MUSIC')) {
            return 'NOT_MUSIC';
          }
        }
        return null; // skip header lines
      })
      .filter(classification => classification !== null);

    // Filter music videos based on Groq's response
    const musicVideos = [];
    likedVideos.forEach((video, index) => {
      if (classifications[index] === 'MUSIC') {
        musicVideos.push(video);
      }
    });

    // Update database with music classification
    for (const video of musicVideos) {
      await youtubeVideo.updateOne(
        { userId: userID, videoId: video.videoId },
        { isMusic: true }
      );
    }

    // Mark non-music videos
    const musicVideoIds = musicVideos.map(v => v.videoId);
    await youtubeVideo.updateMany(
      { 
        userId: userID, 
        videoId: { $nin: musicVideoIds } 
      },
      { isMusic: false }
    );
    if (process.env.NODE_ENV !== 'production'){
      console.log(`Groq found ${musicVideos.length} music videos out of ${likedVideos.length} total`);
      console.log(classifications)
    }
   
    return {
      total: likedVideos.length,
      musicCount: musicVideos.length,
      musicVideos: musicVideos
    };

}
catch(error){
  console.log("error with filter liked videos", error)
  throw error
}

}

/**
 * Gets videos marked as music for a user from MongoDB.
 * @param {string} userID - User's ID
 * @returns {Promise<Array>} Array of music video objects
 */
const getMusicVideos = async (userID) => {
  try{
     const musicVideos = await youtubeVideo.find({userId: userID, isMusic: true});
     return musicVideos;
  }

  catch(error){
    console.log({"error with getting music videos": error }); 
    throw error;
  }
  
}


/**
 * Searches Spotify for each music video’s title and saves the found track URI to MongoDB.
 * @param {string} spotifyAccessToken - Spotify access token
 * @param {string} userID - User's ID
 * @returns {Promise<void>}
 */
const getTrackUri = async (spotifyAccessToken, userID) => {

try{
  const musicVideos = await getMusicVideos(userID)
  for (const video of musicVideos){
    try{
      const searchResult = await searchforSong(spotifyAccessToken, video.title)//ISSUE HERE
      
      await youtubeVideo.updateOne({ userId: userID, videoId: video.videoId}, {trackUri: searchResult}) // (the item, the update of the item)
    }

   catch(error){
    console.error("error serach for songs")
   }
  }
}

catch(error){
  console.error("error in da get track uri")
}
}


/**
 * Uses Groq to recommend more songs based on user’s music videos and saves their Spotify URIs.
 * @param {string} userId - User's ID
 * @param {string} spotifyAccessToken - Spotify access token
 * @param {number} neededAmount - Number of recommendations needed
 * @returns {Promise<void>}
 */
const recommnedMoreSongs = async (userId, spotifyAccessToken, neededAmount) => {
  try{
  const songs = await getMusicVideos(userId)
  const songObjects = songs;


  const titles = songObjects.map(song => song.title);

  const prompt = `I want you to act as Spotify and recommend ${neededAmount} songs based on a list of songs I will give you.
The list of songs comes from YouTube video titles, so based on those titles, recommend more songs like them.
When selecting songs, consider similar artists, genre, tone, energy, popularity, albums from similar artist, and reviews that say anything about the song, danceability, key, niche, and tempo.
When looking for songs, do not recommend songs that are already in the list I gave you. 
Only return exactly ${neededAmount} songs. Respond only with that number of songs.
Each song recommendation should include only the artist and song title—nothing else. Have one recommendation per line.

List of Songs:
${titles.join('\n')}

Response format example:
Artist, Song title

Recommendations:`;

    const completion = await groq.chat.completions.create({ 
     messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7, 
      max_tokens: 300,
      top_p: 0.9
  
    })

    // I want to parse this so I can add it to the recsongcollection. If there are already songs in the rec table delete them and add the new ones
    const recommendationText =  completion.choices[0].message.content
    if (process.env.NODE_ENV !== 'production'){
      console.log("recommendationText", recommendationText)
    }
    
   
    // get the reuslts of serach songs and add only the user id trackuri of each song to recsong colletion
    const songLines = recommendationText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes(','))
      .map(line => {
        const [artist, ...songParts] = line.split(',');
        return [artist.trim(), songParts.join(',').trim()];
      })
      .filter(([artist, song]) => artist && song);


      if (process.env.NODE_ENV !== 'production') {
        console.log("song linez", songLines)
     
    }
      

    // get the reuslts of serach songs and add only the user id trackuri of each song to recsong colletion
    await recSongCollection.deleteMany({ userId: userId });
    

 for (const [artist, song] of songLines) {
  const trackUri = await searchforSong(spotifyAccessToken, `${artist} ${song}`);
  if (trackUri) {
    await recSongCollection.updateOne(
      { userId: userId, trackUri: trackUri },
      { $set: { userId: userId, trackUri: trackUri } },
      { upsert: true }
    );
  }
}
  }
  catch(error){
    console.error("Issue with da rec more songs")
    if (process.env.NODE_ENV !== 'production') {
        console.error(error.stack);
    }
  }
  
}

/**
 * Adds music and recommended songs to a Spotify playlist for the user.
 * @param {string} spotifyUserId - Spotify user ID
 * @param {string} spotifyAccessToken - Spotify access token
 * @param {string} userID - User's ID
 * @param {Array} playlist - [playlistLink, playlistId]
 * @returns {Promise<void>}
 */

const createCuratedPlaylsit = async(spotifyUserId, spotifyAccessToken, userID, playlist) => {
  
  try{
    const playlistLink = playlist[0];
    const playlistId = playlist[1];
    if (process.env.NODE_ENV !== 'production') {
        console.log("this the link dude", playlistLink)
        
    }
  
    await user.updateOne({ userId: userID }, { $set: { playlistId, playlistLink } });
    
    const videosWithUris = await youtubeVideo.find({userId: userID, trackUri: {$ne:null}})
    let recTrackUris= []

    const trackUriStrings = videosWithUris.map(video => video.trackUri);
    // Filter for unique track URIs
    const uniqueTrackUris = [...new Set(trackUriStrings)];

    if (process.env.NODE_ENV !== 'production') {
      console.log(uniqueTrackUris, "This is what is used to add songs to playlist")
      console.log("URIs to add:", uniqueTrackUris); 
      console.log("Rec URIs to add:", recTrackUris);
    }
     

    try {
      if (uniqueTrackUris.length > 0) {
        await addSongtoPlaylsit(playlistId, uniqueTrackUris, spotifyAccessToken);
      }
    } catch (error) {
      console.error("Issue with adding songs to playlist");
    }
    // need to get playlist lentgh
    const neededAmount = 20 - uniqueTrackUris.length;
    
    if (trackUriStrings.length < 20){
      await recommnedMoreSongs(userID,spotifyAccessToken, neededAmount)
      // get rec songs, then add rec songs to playlist
      const recSongs = await recSongCollection.find({userId: userID})
        .limit(20 - uniqueTrackUris.length);
      recTrackUris = recSongs.map(song => song.trackUri);
      await addSongtoPlaylsit(playlistId, recTrackUris, spotifyAccessToken);;
      
    }
      
}
  catch(error){
    console.error("error with da creating and updating of da playlist")
    if (process.env.NODE_ENV !== 'production') {
        console.error(error.stack);
    }
    
  }
}

/**
 * Orchestrates fetching, filtering, and building a Spotify playlist for a user.
 * @param {Object} user - User object with tokens and IDs
 * @returns {Promise<Object>} Playlist object or error object ({ error: "NO_MUSIC_VIDEOS" })
 */
async function buildPlaylistForUser(user) {
  const accessToken = user.accessToken;
  const userId = user.userId;
  const spotifyAccessToken = user.spotifyAccessToken;
  const spotifyUserId = user.spotifyId;

  await saveLikedVideos(userId, accessToken);
  const filterResult = await filerLikedVideos(userId);
  
  if (filterResult.musicVideos.length === 0) {
    return { error: "NO_MUSIC_VIDEOS" };
  }



  await getTrackUri(spotifyAccessToken, userId);
  const playlist = await initiatePlaylsit(userId,spotifyAccessToken)
  const FilledPlayList = await createCuratedPlaylsit(spotifyUserId, spotifyAccessToken, userId, playlist );
  return FilledPlayList;
}

/**
 * Updates a user’s playlist, used in daily refresh.
 * @param {Object} user - User object
 * @param {Array} playlist - [playlistLink, playlistId]
 * @returns {Promise<Object>} Playlist object or error object ({ error: "NO_MUSIC_VIDEOS" })
 */
async function updatePlaylist(user, playlist){
  const accessToken = user.accessToken;
  const userId = user.userId;
  const spotifyAccessToken = user.spotifyAccessToken;
  const spotifyUserId = user.spotifyId;


  await saveLikedVideos(userId, accessToken);
  const filterResult = await filerLikedVideos(userId);
  
  if (filterResult.musicVideos.length === 0) {
    return { error: "NO_MUSIC_VIDEOS" };
  }

  await getTrackUri(spotifyAccessToken, userId);
  const FilledPlayList = await createCuratedPlaylsit(spotifyUserId, spotifyAccessToken, userId, playlist );
  return FilledPlayList;

}

/**
 * Clears the user’s Spotify playlist and then updates it with new music.
 * @param {Object} currentUser - User object with playlist info
 * @returns {Promise<void>}
 */
const clearAndUpdatePlaylist = async (currentUser) => {
  const playlistId = currentUser.playlistId;
  const spotifyAccessToken = currentUser.spotifyAccessToken;

  await emptyPlaylist(playlistId, spotifyAccessToken);

  const playlistLink = currentUser.playlistLink;
  const playlist = [playlistLink, playlistId];

  await updatePlaylist(currentUser, playlist);
};


module.exports = {saveLikedVideos, getLikedVideos, filerLikedVideos, getMusicVideos, getTrackUri, createCuratedPlaylsit, recommnedMoreSongs, buildPlaylistForUser, updatePlaylist, clearAndUpdatePlaylist }