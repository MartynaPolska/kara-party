import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Volume2,
  Gauge,
  ChevronDown,
} from 'lucide-react';

const MobileAudioPlayer = ({ audioRef, currentTime, setCurrentTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSpeedChange = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVolumeChange = (value) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-xl p-4 shadow-lg text-white space-y-4">
      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          const newTime = parseFloat(e.target.value);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }}
        className="w-full accent-white h-2"
      />

      {/* Main Controls */}
      <div className="flex justify-center items-center gap-6">
        <button onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
          <Rewind size={24} />
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button onClick={() => skip(10)} aria-label="Forward 10 seconds">
          <FastForward size={24} />
        </button>
      </div>

      {/* Toggle Settings */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm text-white hover:text-indigo-200"
        >
          <ChevronDown size={16} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          More Options
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="flex flex-col gap-4">
          {/* Speed */}
          <div className="flex items-center gap-4">
            <Gauge size={20} />
            {[0.75, 1, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-2 py-1 rounded text-sm ${
                  playbackRate === rate ? 'bg-white text-black font-semibold' : 'bg-indigo-300 text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4">
            <Volume2 size={20} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAudioPlayer;
