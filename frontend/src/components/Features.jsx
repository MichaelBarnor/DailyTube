import React from 'react'
import { YoutubeIcon, MusicIcon, SparklesIcon } from 'lucide-react'
export function Features() {
  return (
    <section className="w-full py-16 bg-[#1e2433] px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          How DailyTube Works
        </h2>
        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Transform your YouTube music discovery into Spotify playlists
          automatically
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<YoutubeIcon size={28} className="text-[#FF0000]" />}
            title="Connect YouTube"
            description="Link your YouTube account to track the music content you watch and enjoy. The more videos you like, the more personalized your DailyTube Mix is."
            step="1"
            borderColor="border-[#FF0000]"
          />
          <FeatureCard
            icon={<MusicIcon size={28} className="text-[#4ade80]" />}
            title="Link Spotify"
            description="Connect your Spotify account to enable automatic playlist creation."
            step="2"
            borderColor="border-[#4ade80]"
          />
          <FeatureCard
            icon={<SparklesIcon size={28} className="text-white" />}
            title="Daily Playlists"
            description="Get fresh Spotify playlists created daily based on your YouTube music discoveries."
            step="3"
            borderColor="border-white"
          />
        </div>
        <div className="mt-16 bg-gradient-to-br from-[#FF0000]/10 to-[#4ade80]/10 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Why Users Love DailyTube
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="Before bed I'm always bumping some tunes on YouTube, and now it's automatically in my Spotify playlists!"
              author="David B."
            />
            <Testimonial
              quote="I finish all my Daily Mixes and now I have more!!"
              author="MK B."
            />
            <Testimonial
              quote="It's like having a personal DJ that knows exactly what music I like from YouTube."
              author="Abrar C."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
function FeatureCard({ icon, title, description, step, borderColor }) {
  return (
    <div
      className={`bg-[#252a3a] p-6 rounded-xl relative border-2 ${borderColor}`}
    >
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#252a3a] flex items-center justify-center text-white font-bold border-2 border-current">
        {step}
      </div>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}
function Testimonial({ quote, author }) {
  return (
    <div className="bg-[#252a3a] p-4 rounded-lg shadow text-white">
      <p className="italic mb-2">"{quote}"</p>
      <p className="text-right text-gray-400 font-medium">— {author}</p>
    </div>
  )
}
