import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "CYBERNETIC_HORIZON.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "NEON_GRID_RUNNER.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "DIGITAL_DREAMS.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
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
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  // Generate ASCII progress bar
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const asciiProgress = '[' + '#'.repeat(filledLength) + '-'.repeat(barLength - filledLength) + ']';

  return (
    <div className="w-full bg-black border-2 border-[#ff00ff] p-6 relative">
      <div className="absolute top-0 right-0 w-2 h-full bg-[#00ffff] animate-pulse" />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <h2 className="text-xl font-pixel text-[#00ffff] mb-6 uppercase border-b border-[#00ffff] pb-2">AUDIO_SUBSYSTEM</h2>

      <div className="mb-6">
        <div className="text-xs text-[#ff00ff] font-pixel mb-1">CURRENT_STREAM:</div>
        <div className="text-lg font-terminal text-[#00ffff] truncate bg-[#00ffff]/10 p-2 border border-[#00ffff]">
          {'>'} {currentTrack.title}
        </div>
      </div>

      {/* ASCII Progress Bar */}
      <div 
        className="mb-6 cursor-pointer font-terminal text-xl text-[#ff00ff] tracking-widest text-center"
        onClick={handleProgressClick}
      >
        {asciiProgress}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border border-[#ff00ff] p-2">
          <button 
            onClick={playPrev}
            className="px-3 py-1 bg-black text-[#00ffff] border border-[#00ffff] font-pixel text-xs hover:bg-[#00ffff] hover:text-black transition-colors uppercase cursor-pointer"
          >
            [ PREV ]
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-4 py-2 bg-[#ff00ff] text-black font-pixel text-sm hover:bg-[#00ffff] transition-colors uppercase cursor-pointer"
          >
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>
          
          <button 
            onClick={playNext}
            className="px-3 py-1 bg-black text-[#00ffff] border border-[#00ffff] font-pixel text-xs hover:bg-[#00ffff] hover:text-black transition-colors uppercase cursor-pointer"
          >
            [ NEXT ]
          </button>
        </div>

        <div className="flex items-center justify-between bg-[#00ffff]/10 p-2 border border-[#00ffff]">
          <span className="text-xs font-pixel text-[#00ffff]">VOL_MOD:</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#ff00ff] font-pixel text-xs hover:text-[#00ffff] cursor-pointer"
            >
              {isMuted ? 'MUTED' : 'ACTIVE'}
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
              className="w-24 appearance-none bg-black border border-[#ff00ff] h-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00ffff] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
