import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-between p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Background ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="w-full max-w-5xl flex flex-col items-center justify-center py-6 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            NEON SNAKE
          </h1>
          <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
        </div>
        <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">Cybernetic Edition</p>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center w-full max-w-6xl gap-12 z-10">
        
        {/* Left/Top: Game */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="w-full xl:w-[400px] flex justify-center xl:justify-start">
          <MusicPlayer />
        </div>

      </main>

      <footer className="w-full text-center py-6 text-zinc-600 font-mono text-xs z-10">
        <p>AI Studio Build &bull; React + Tailwind CSS</p>
      </footer>
    </div>
  );
}
