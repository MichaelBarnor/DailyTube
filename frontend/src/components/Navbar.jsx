import React from 'react'
import { LogIn } from 'lucide-react'

export function Navbar() { // write a function that leads to the path i set up for liked videos

  const handleLinktoYouTubeAuth = () =>{ // when lciked on this functon it should lead you to the correct link
    window.location.href =  "https://dailytube-e61b5db174d0.herokuapp.com/api/auth/google";
    // "http://127.0.0.1:4000/api/auth/google"
  }

  return (
    <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-white font-bold text-2xl">
          <span className="text-[#4ade80]">Daily</span>
          <span className="text-[#FF0000]">Tube</span> 
        </div>
      </div>
      <div className="flex items-center">
        <button onClick = {handleLinktoYouTubeAuth}
        className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-medium px-4 py-2 rounded-full flex items-center">
          <LogIn size={18} className="mr-2" />
          Sign in with YouTube
        </button>
      </div>
    </header>
  )
}
