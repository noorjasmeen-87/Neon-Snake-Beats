import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive (AI Gen)',
    artist: 'CyberBot Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Pulse (AI Gen)',
    artist: 'Neural Net',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Horizon (AI Gen)',
    artist: 'SynthMind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Track Info */}
        <div className="flex items-center gap-4 mb-6 w-full">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <Disc3 className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-lg font-bold text-white truncate neon-text-cyan">{currentTrack.title}</h3>
            <p className="text-sm text-purple-300 truncate">{currentTrack.artist}</p>
          </div>
          
          {/* Visualizer */}
          <div className="flex items-end gap-1 h-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1.5 bg-cyan-400 rounded-t-sm ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                style={{
                  height: isPlaying ? `${Math.random() * 100}%` : '4px',
                  animationDuration: `${0.5 + i * 0.1}s`,
                  boxShadow: '0 0 8px rgba(34,211,238,0.8)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={playPrev}
              className="p-2 text-zinc-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500 text-zinc-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            
            <button 
              onClick={playNext}
              className="p-2 text-zinc-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
