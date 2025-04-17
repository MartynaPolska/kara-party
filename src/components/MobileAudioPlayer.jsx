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
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (e) => {
    const newRate = parseFloat(e.target.value);
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-800 to-indigo-500 text-white rounded-lg p-4 flex flex-col gap-3">
      {/* Progress */}
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
        className="w-full accent-white h-1 cursor-pointer"
      />

      {/* Core Controls */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={() => skip(-10)} title="Rewind">
          <Rewind size={26} />
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-black rounded-full p-3"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button onClick={() => skip(10)} title="Forward">
          <FastForward size={26} />
        </button>
      </div>

      {/* Expandable Settings */}
      <div className="mt-2 text-sm text-center">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center justify-center gap-2 text-indigo-300"
        >
          Settings <ChevronDown size={16} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {showSettings && (
          <div className="mt-3 space-y-3">
            {/* Speed */}
            <div className="flex items-center gap-2">
              <Gauge size={18} />
              <input
                type="range"
                min={0.75}
                max={1.5}
                step={0.25}
                value={playbackRate}
                onChange={handleSpeedChange}
                className="accent-white w-full h-1"
              />
              <span className="text-sm w-12 text-right">{playbackRate.toFixed(2)}x</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 size={18} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="accent-white w-full h-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAudioPlayer;
