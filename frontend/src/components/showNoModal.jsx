import React from 'react';
import { MusicIcon } from 'lucide-react';

function YouTubeLogo({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.413 3.5 12 3.5 12 3.5s-7.413 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.16 0 12 0 12s0 3.84.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.587 20.5 12 20.5 12 20.5s7.413 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.84 24 12 24 12s0-3.84-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function ShowNoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#252a33] rounded-lg p-8 text-center shadow-lg">
        <MusicIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Music Videos Found :(</h2>
        <p className="text-gray-300 mb-6">
          It seems you haven't liked any music type videos on YouTube.<br />
          Go like some of your favorite songs and come back to make your DailyTube Mix!
        </p>
        <div className="flex flex-row gap-4 justify-center">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full font-medium text-base flex items-center justify-center"
            style={{ minWidth: "120px", maxWidth: "160px" }}
          >
            Back
          </button>
          <button
            onClick={() => window.open('https://www.youtube.com/', '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full font-medium text-base flex items-center justify-center gap-2"
            style={{ minWidth: "120px", maxWidth: "160px" }}
          >
            
            YouTube
            <YouTubeLogo className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}