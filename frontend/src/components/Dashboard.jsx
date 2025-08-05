import React, {useState, useEffect} from 'react'
import { ShowNoModal } from './showNoModal';
import { Header } from './Header'
import { FaSpotify } from 'react-icons/fa';
import {
  MusicIcon,
  UserIcon,
  Clock3Icon,
} from 'lucide-react'

export function Dashboard() {

  const [showPlaylist, setShowPlaylist] = useState(false)
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistCover, setPlaylistCover] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState({ firstName: '', profilePic: '', playlistLink:'' });
  const [loading, setLoading] = useState(false);
  const [showNoMusicModal, setShowNoMusicModal] = useState(false);

  //showPlayist is a boolean that is set by false by useSate,
  //The only function that can change this is setShowPlayslit


   useEffect(() => {
    if (accessToken) {
      (async () => {
        const data = await fetchWithAutoRefresh(
          '/api/user/me',
          accessToken,
          setAccessToken
        );
        if (data) setUser(data);
        console.log(data)
      })();
    }
  }, [accessToken]);// depedns on when access token is set



  useEffect(() => {
      // Get access token from backend using refresh token cookie
      fetch('/api/auth/access-token', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          console.log("Access token response:", data);
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            const params = new URLSearchParams(window.location.search);
          }
        });
    
  }, []);


useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('no_music') === 'true') {
    setShowNoMusicModal(true);
    setShowPlaylist(false);
    setPlaylistTracks([]);
    setPlaylistCover("");
    setLoading(false);
    return;
  }

    (async () => { // calls current, if null dont show anything besides modal, if not nul set cover, tracks, and show playlist
      const data = await fetchWithAutoRefresh(
        '/api/playlist/current',
        accessToken,
        setAccessToken
      );
      setLoading(false);

      if (data && data.error === "NO_MUSIC_VIDEOS") {
        setShowNoMusicModal(true);
        setShowPlaylist(false);
        setPlaylistTracks([]);
        setPlaylistCover("");
        return;
      }

      const playlistCover = await fetchWithAutoRefresh(
        '/api/playlist/cover',
        accessToken,
        setAccessToken
      );
      setPlaylistCover(playlistCover || "");
      setPlaylistTracks(data || []);
      setShowPlaylist(true);
    })();
 
}, [accessToken]);


  async function fetchWithAutoRefresh(url, accessToken, setAccessToken) {
  if (!accessToken) {
    // Don't make the request if the token is missing
    return null;
  }
  let res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (res.status === 401) {
    // Try to refresh access token
    console.log("it failed")
    const tokenRes = await fetch('/api/auth/access-token', { credentials: 'include' });
    const tokenData = await tokenRes.json();
    if (tokenData.accessToken) {
      setAccessToken(tokenData.accessToken);
      // Retry original request
      res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${tokenData.accessToken}` }
      });
      return res.json();
    } else {
      // No valid token, return null or handle error
      return null;
    }
  }
  return res.json();
}

  const hanleLinktoSpotifyAuth = () =>{
    setLoading(true);
    window.location.href =  "https://dailytube-e61b5db174d0.herokuapp.com/api/auth/spotify"
   
  }


  const handleLinktoPlaylsit = () =>{
     if (user.playlistLink) {
    window.open(user.playlistLink, '_blank');
  } else {
    alert('Playlist link not found.');
  }

  }

  function parseDuration(duration) {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string' && duration.includes(':')) {
      const [min, sec] = duration.split(':').map(Number);
      return min * 60 + sec;
    }
    return Number(duration) || 0;
  }

  const totalSeconds = playlistTracks.reduce(
    (sum, track) => sum + parseDuration(track.duration),
    0
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let durationString = '';
  if (hours > 0) {
    durationString = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
  } else {
    durationString = `${minutes} min`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161a23] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl font-bold">Creating your playlist...</p>
        </div>
      </div>
    );
  }

  

  return (
  
    <div className="min-h-screen flex flex-col bg-[#161a23] text-white">
      <Header />
      {showNoMusicModal && (
    <ShowNoModal onClose={() => setShowNoMusicModal(false)} />
  )}
      <main className="flex flex-1 p-6">
        {/* Sidebar */}
        <div className="w-64 bg-[#252a33] rounded-lg p-4 mr-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 p-3 bg-[#1a1e25] rounded-lg">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserIcon className="w-10 h-10 text-gray-300" />
              )}
              <div>
                <h3 className="font-medium">{user.firstName || "YouTube User"}</h3>
                <p className="text-sm text-gray-400">Connected</p>
              </div>
            </div>
          </div>
          <nav>
            <ul className="space-y-2">
              <li className="p-3 bg-[#2d3340] rounded-lg flex items-center space-x-3 cursor-pointer">
                <FaSpotify className="text-green-500" size={20}  />
                <span>Current Playlist </span>
              </li>
              
            </ul>
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1">
          {/* --- CONDITIONAL RENDER START --- */}
          {showPlaylist ? (
            <>
              {/* Playlist content (shown when showPlaylist is true) */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Current Playlist</h1>
                
              </div>
              <div className="bg-[#252a33] rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-40 h-40 flex-shrink-0 rounded-lg flex items-center justify-center">
                      {playlistCover ? (
                      <img
                        src={playlistCover}
                        alt="Playlist Cover"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                               ) : (
                      <MusicIcon className="w-16 h-16 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">My DailyTube Mix</h2>
                    <p className="text-gray-400 mb-4">
                      Created from your YouTube history
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-400">
                        <span className="text-white font-medium">
                          {playlistTracks.length}
                        </span>{' '}
                        tracks
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="text-white font-medium">{durationString}</span>
                      </div>
                      <button
                        onClick= {handleLinktoPlaylsit}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-full text-sm font-medium transition-colors"
                      >
                        Open in Spotify
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#252a33] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Artist</th>
                      <th className="py-3 px-4">Album</th>
                      <th className="py-3 px-4">
                        <Clock3Icon size={16} />
                      </th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {playlistTracks.map((track, index) => (
                      <TrackRow key={track.id} track={track} index={index + 1} />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // --- EMPTY STATE (shown when showPlaylist is false) ---
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-full flex items-center justify-center mb-6">
                <MusicIcon className="w-16 h-16 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Create Your Playlist</h1>
              <p className="text-gray-400 mb-8 max-w-md">
                Connect to Spotify to create a personalized playlist based on your YouTube music history
              </p>
              
              <button 
                onClick={hanleLinktoSpotifyAuth}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full flex items-center space-x-2 transition-colors"
              >
                <FaSpotify size={20} />
                <span>Create Playlist with Spotify</span>
              </button>
            </div>
          )}
          {/* --- CONDITIONAL RENDER END --- */}
        </div>
      </main>
    </div>
  )
}

function TrackRow({ track, index }) {
  return (
    <tr className="hover:bg-[#2d3340] group">
      <td className="py-3 px-4 text-gray-400">{index}</td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <img
            src={track.albumCover}
            alt={track.album}
            className="w-10 h-10 rounded"
          />
          <span className="font-medium">{track.title}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300">{track.artist}</td>
      <td className="py-3 px-4 text-gray-400">{track.album}</td>
      <td className="py-3 px-4 text-gray-400">{track.duration}</td>
      <td className="py-3 px-4">
      </td>
    </tr>
  )
}
