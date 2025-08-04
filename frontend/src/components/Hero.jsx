import React from 'react'
import { LogIn } from 'lucide-react'
export function Hero() {
  const handleLinktoYouTubeAuth = () =>{ // when lciked on this functon it should lead you to the correct link
    window.location.href =  "http://127.0.0.1:4000/api/auth/google"
  }
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Turn Your <span className="text-[#FF0000]">YouTube</span> Watches
            Into
            <span className="text-[#4ade80]"> Spotify</span> Playlists
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Sign in with your YouTube account to get started. We'll help you
            discover and create Spotify playlists from the music in your
            favorite YouTube videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick = {handleLinktoYouTubeAuth} className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-medium px-6 py-3 rounded-full flex items-center justify-center">
              <LogIn size={20} className="mr-2" />
              Sign in with YouTube
            </button>
          </div>
        </div>
        <div className="md:w-1/2 bg-gradient-to-br from-[#FF0000]/10 to-[#4ade80]/10 p-8 rounded-2xl">
          <img
            src="/frontpagedaily.png"
            alt="Music streaming interface showing playlist creation"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
