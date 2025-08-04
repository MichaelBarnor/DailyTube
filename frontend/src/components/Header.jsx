import React from 'react'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      // Optionally clear any client-side state here
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  }

  
  return (
    <header className="bg-[#252a33] p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-red-500">Daily</span>
          <span className="text-green-500">Tube</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium">Connected with YouTube</p>
          <p className="text-sm text-gray-400">Ready to create playlists</p>
        </div>
        <button onClick = {handleLogOut} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full">
          <LogOutIcon size={20} />
        </button>
      </div>
    </header>
  )
}
