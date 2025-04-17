import React from 'react';
import MobileAudioPlayer from './MobileAudioPlayer';

const MobileApp = ({
  selectedSong,
  setSelectedSong,
  searchTerm,
  setSearchTerm,
  selectedArtist,
  setSelectedArtist,
  selectedGenre,
  setSelectedGenre,
  filteredSongs,
  currentTime,
  setCurrentTime,
  fontSize,
  setFontSize,
  audioRef,
  lyricsRef,
  isUserScrolling,
  setIsUserScrolling,
  isSidebarOpen,
  setIsSidebarOpen,
  getActiveLyricIndex,
  scrollTimer,
}) => {
  return (
    <div className="w-full mb-4 space-y-4 relative min-h-screen px-2 pt-4">
      {/* ✅ Floating Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-white/20 backdrop-blur-md hover:bg-white/30 transition"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ✅ Cover Image */}
      {selectedSong.coverImage && (
        <img
          src={selectedSong.coverImage}
          alt={`${selectedSong.title} cover`}
          className="w-full max-w-full rounded-xl shadow-lg object-cover"
        />
      )}

      {/* ✅ Sidebar content (toggleable) */}
      {isSidebarOpen && (
        <div className="bg-white/10 p-4 rounded-lg space-y-4 mt-2">
          <input
            type="text"
            placeholder="🔍 Search songs..."
            className="w-full px-4 py-2 rounded-md border focus:outline-none text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 rounded-md border text-black"
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
          >
            <option value="">Select Artist</option>
            {[...new Set(filteredSongs.map(song => song.artist))].map((artist, idx) => (
              <option key={idx} value={artist}>{artist}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 rounded-md border text-black"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select genre</option>
            {[...new Set(filteredSongs.map(song => song.genre))].map((genre, idx) => (
              <option key={idx} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ Song list */}
      <div className="space-y-2 mt-4">
        {filteredSongs.map((song, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md cursor-pointer transition ${
              selectedSong === song ? 'bg-white text-black font-bold' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => {
              setCurrentTime(0);
              setSelectedSong(song);
              setIsSidebarOpen(false);
            }}
          >
            <div>{song.title}</div>
            <div className="text-sm text-gray-300">{song.artist}</div>
            <div className="text-xs text-indigo-300">{song.genre}</div>
          </div>
        ))}
      </div>

      {/* ✅ Audio Player */}
      <MobileAudioPlayer
        audioRef={audioRef}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
      />

      {/* ✅ Hidden audio element */}
      <audio
        key={selectedSong.audioUrl}
        ref={audioRef}
        src={selectedSong.audioUrl}
        preload="metadata"
        className="hidden"
      />

      {/* ✅ Lyrics Viewer */}
      <div
        ref={lyricsRef}
        onScroll={() => {
          setIsUserScrolling(true);
          clearTimeout(scrollTimer.current);
          scrollTimer.current = setTimeout(() => {
            setIsUserScrolling(false);
          }, 5000);
        }}
        className="max-h-[60vh] overflow-y-auto bg-gray-100 rounded-md p-4 text-gray-800 space-y-2 mx-auto"
        style={{
          fontSize: fontSize,
          maxWidth: '500px',
          textAlign: 'left',
        }}
      >
        {selectedSong.syncedLyrics ? (
          selectedSong.syncedLyrics.map((line, idx) => {
            const activeIdx = getActiveLyricIndex(selectedSong.syncedLyrics);
            const isActive = idx === activeIdx;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 ${
                  isActive ? 'text-indigo-600 font-semibold active-lyric' : 'text-gray-700'
                }`}
              >
                {line.text}
              </div>
            );
          })
        ) : (
          <pre>No lyrics available.</pre>
        )}
      </div>
    </div>
  );
};

export default MobileApp;
