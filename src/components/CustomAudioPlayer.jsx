import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Rewind,
  FastForward,
  Gauge,
} from 'lucide-react';

const CustomAudioPlayer = ({ audioRef, currentTime, setCurrentTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setDuration(audio.duration);
      setIsPlaying(!audio.paused);
    };

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

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <div className="w-full rounded-lg p-4 flex flex-col gap-4 shadow-md border border-white/20 text-white bg-gradient-to-br from-indigo-800 to-indigo-500">
      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full accent-white h-2 cursor-pointer"
      />

      {/* Controls Row */}
      <div className="flex items-center justify-between w-full flex-wrap gap-4">
        {/* Playback Speed (Left) */}
        <div className="flex items-center gap-2">
          <Gauge size={20} />

          <div className="relative">
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={[0.75, 1, 1.5].indexOf(playbackRate)}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                const rates = [0.75, 1, 1.5];
                const newRate = rates[value];
                audioRef.current.playbackRate = newRate;
                setPlaybackRate(newRate);
              }}
              className="accent-white w-24 h-1 cursor-pointer"
              title="Playback Speed"
            />

            {/* Tick Marks */}
            <div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2 px-1">
              {[0, 1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[2px] h-3 bg-white opacity-60 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Speed Display */}
          <span className="text-sm w-10 text-right">{playbackRate.toFixed(2)}x</span>
        </div>

        {/* Main Controls (Centered) */}
        <div className="flex items-center justify-center flex-1 gap-6">
          <button
            onClick={() => skip(-10)}
            className="hover:text-indigo-300 transition"
            title="Back 10s"
          >
            <Rewind size={26} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} />}
          </button>

          <button
            onClick={() => skip(10)}
            className="hover:text-indigo-300 transition"
            title="Forward 10s"
          >
            <FastForward size={26} />
          </button>
        </div>

        {/* Volume (Right) */}
        <div className="flex items-center gap-2">
          <Volume2 size={20} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="accent-white w-24 h-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
