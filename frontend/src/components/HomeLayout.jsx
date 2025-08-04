import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Features } from './Features'

export function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#161a23]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2025 DailyTube. All rights reserved.</p>
      </footer>
    </div>
  );
}