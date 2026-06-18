import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38); // Visual starting point
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);

  // Traditional sweet wedding notes (Yaman Raga / G-Major pentatonic warm chimes)
  // G4(392Hz), B4(494Hz), C5(523Hz), D5(587Hz), F#5(740Hz), G5(784Hz)
  const notes = [
    392.00, 493.88, 523.25, 587.33, 739.99, 783.99, 
    880.00, 987.77, 1046.50
  ];

  // Warm chord pad notes
  const padChords = [
    [196.00, 293.66, 392.00, 493.88], // G Major
    [220.00, 329.63, 440.00, 523.25], // A minor
    [164.81, 246.94, 329.63, 392.00], // E minor
    [174.61, 261.63, 349.23, 440.00], // C Major
  ];

  const playSynthesizedMelody = (ctx: AudioContext, destination: AudioNode) => {
    let noteIndex = 0;
    let chordIndex = 0;
    
    const playTick = () => {
      // 1. Play melody plucks occasionally (every 0.5s - 1.5s helper)
      if (Math.random() > 0.4) {
        const rootOsc = ctx.createOscillator();
        const pluckGain = ctx.createGain();
        
        // Soft chime tone (sine wave + filter)
        rootOsc.type = "sine";
        const note = notes[Math.floor(Math.random() * notes.length)];
        rootOsc.frequency.setValueAtTime(note, ctx.currentTime);
        
        pluckGain.gain.setValueAtTime(0.0, ctx.currentTime);
        pluckGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05); // low volume
        pluckGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        
        // Simulating sitar resonance with a subtle delay/comb filter in mind
        // or just filtering out high harsh frequencies
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        
        rootOsc.connect(filter);
        filter.connect(pluckGain);
        pluckGain.connect(destination);
        
        rootOsc.start(ctx.currentTime);
        rootOsc.stop(ctx.currentTime + 1.5);
      }

      // 2. Play warm background pad chord (every 3 seconds)
      if (noteIndex % 6 === 0) {
        const currentChord = padChords[chordIndex % padChords.length];
        chordIndex++;

        currentChord.forEach((freq) => {
          const padOsc = ctx.createOscillator();
          const padGain = ctx.createGain();
          
          padOsc.type = "triangle"; // softer and warmer than sine
          padOsc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          padGain.gain.setValueAtTime(0.0, ctx.currentTime);
          padGain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 1.5); // extremely subtle
          padGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);
          
          const padFilter = ctx.createBiquadFilter();
          padFilter.type = "lowpass";
          padFilter.frequency.setValueAtTime(450, ctx.currentTime);
          
          padOsc.connect(padFilter);
          padFilter.connect(padGain);
          padGain.connect(destination);
          
          padOsc.start(ctx.currentTime);
          padOsc.stop(ctx.currentTime + 5.0);
        });
      }

      noteIndex++;
    };

    // Immediate first tick
    playTick();
    const intervalId = window.setInterval(playTick, 600);
    return intervalId;
  };

  const togglePlayback = () => {
    if (!isPlaying) {
      // Resume or create AudioContext
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create Volume Control Node
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(isMuted ? 0 : 0.4, ctx.currentTime);
      gainNode.connect(ctx.destination);
      volumeNodeRef.current = gainNode;

      // Start Synthesized Loop
      const intervalId = playSynthesizedMelody(ctx, gainNode);
      synthIntervalRef.current = intervalId;
      setIsPlaying(true);
    } else {
      // Stop loop
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.setValueAtTime(
        nextMuted ? 0 : 0.4, 
        audioCtxRef.current.currentTime
      );
    }
  };

  // Update track active bar progress continuously
  useEffect(() => {
    let progressTimer: number;
    if (isPlaying) {
      progressTimer = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.3));
      }, 300);
    }
    return () => clearInterval(progressTimer);
  }, [isPlaying]);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div 
      className="bg-cream-soft/90 backdrop-blur-md max-w-sm mx-auto border border-wedding-pink-medium rounded-2xl p-4 shadow-md flex items-center gap-4 relative overflow-hidden"
      id="ambient-music-player"
    >
      {/* Decorative Golden Arch Silhouette inside player */}
      <div className="absolute right-0 top-0 bottom-0 w-24 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 200" fill="none" className="w-full h-full stroke-wedding-burgundy">
          <path d="M10 200 C10 100, 30 20, 50 20 C70 20, 90 100, 90 200" strokeWidth="2" />
          <path d="M20 200 C20 120, 35 40, 50 40 C65 40, 80 120, 80 200" strokeWidth="1" />
        </svg>
      </div>

      {/* Rotating Cover Vinyl */}
      <div className="relative">
        <div 
          className={`w-14 h-14 bg-gradient-to-tr from-wedding-burgundy via-wedding-magenta to-wedding-pink-medium rounded-full flex items-center justify-center shadow-md relative overflow-hidden transition-all duration-700 ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "12s" }}
        >
          {/* Sitar/Music Icon */}
          <Music className="w-6 h-6 text-cream-soft" />
          {/* Inner ring */}
          <div className="absolute w-4 h-4 bg-cream-soft rounded-full border border-wedding-burgundy flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-wedding-burgundy rounded-full"></div>
          </div>
        </div>

        {/* Floating Sound Waves Visualizer when playing */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 flex gap-0.5 bg-wedding-pink-light/90 border border-wedding-pink-medium rounded-full px-1.5 py-0.5 text-[8px] font-bold text-wedding-magenta animate-pulse">
            LIVE SYNTH
          </div>
        )}
      </div>

      {/* Info and controls */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-serif font-semibold text-wedding-burgundy truncate tracking-wide">
          Yaman - Two Hearts, One Journey
        </h4>
        <p className="text-[10px] text-zinc-500 font-sans truncate mb-2">
          Bridal Entry Ambient Orchestrations
        </p>

        {/* Progress bar controller */}
        <div className="relative flex items-center gap-2 mb-1.5">
          <span className="text-[9px] font-mono text-zinc-400">
            {Math.floor((progress * 0.18))}:{String(Math.floor((progress * 10.8) % 60)).padStart(2, "0")}
          </span>
          <div className="h-1 flex-1 bg-zinc-200 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-wedding-magenta rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-[9px] font-mono text-zinc-400">03:00</span>
        </div>

        {/* Player controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className={`p-2 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                ? "bg-wedding-magenta text-cream-soft shadow-sm hover:scale-105" 
                : "bg-wedding-pink-light text-wedding-magenta border border-wedding-pink-medium hover:bg-wedding-pink-medium/30"
              }`}
              title={isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
              id="audio-play-pause-btn"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <span className="text-[10px] font-medium text-wedding-burgundy font-serif">
              {isPlaying ? "Ambient Playing" : "Tap to play music"}
            </span>
          </div>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
            id="audio-mute-btn"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
