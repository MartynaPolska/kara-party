import React, { useState, useRef, useEffect } from 'react';
import songs from './songs';

function App() {
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentTime, setCurrentTime] = useState(0);
  const [fontSize, setFontSize] = useState('1.2rem');
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const audioRef = useRef(null);
  const lyricsRef = useRef(null);
  const scrollTimer = useRef(null);

  // Update currentTime for synced lyrics
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [selectedSong]);

  // Scroll to active lyric unless user is scrolling
  useEffect(() => {
    if (isUserScrolling) return;

    if (lyricsRef.current) {
      const active = lyricsRef.current.querySelector('.active-lyric');
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, isUserScrolling]);

  const genres = ['All', ...new Set(songs.map(song => song.genre))];

  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const getActiveLyricIndex = (lyrics) => {
    if (!lyrics) return -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return -1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-800 to-purple-900 text-white p-4 font-sans flex">
      {/* Sidebar */}
      <div className="w-full sm:w-1/3 lg:w-1/4 bg-white/10 rounded-xl p-4 space-y-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 text-white">🎤 KaraParty</h1>

        <input
          type="text"
          placeholder="🔍 Search songs..."
          className="w-full px-4 py-2 rounded-md border focus:outline-none text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full px-4 py-2 rounded-md border text-black"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre, idx) => (
            <option key={idx} value={genre}>{genre}</option>
          ))}
        </select>

        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredSongs.map((song, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md cursor-pointer transition ${
                selectedSong === song ? 'bg-white text-black font-bold' : 'bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => {
                setCurrentTime(0);
                setSelectedSong(song);
              }}
            >
              <div>{song.title}</div>
              <div className="text-sm text-gray-300">{song.artist}</div>
              <div className="text-xs text-indigo-300">{song.genre}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 ml-4 bg-white text-black rounded-xl p-6 shadow-xl overflow-y-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-1">{selectedSong.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{selectedSong.artist} • {selectedSong.genre}</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Audio + Lyrics */}
          <div className="flex-1 space-y-4">
            {/* Audio Player */}
            <audio
              key={selectedSong.audioUrl}
              ref={audioRef}
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded-lg shadow-md"
            >
              <source src={selectedSong.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            {/* Player Controls Underneath Progress */}
            <div className="flex justify-between items-center mt-2 gap-2">
              {/* Playback Speed Control */}
              <div className="flex items-center gap-1 text-sm">
                <span role="img" aria-label="slow">🐢</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.playbackRate = rate;
                      }
                    }}
                    className="px-2 py-1 bg-indigo-100 rounded text-indigo-700 hover:bg-indigo-200 text-xs"
                  >
                    {rate}x
                  </button>
                ))}
                <span role="img" aria-label="fast">🐇</span>
              </div>

              {/* Font Size Control */}
              <div className="flex items-center gap-2 text-sm">
                <span>🔤</span>
                {[
                  { label: 'S', value: '1rem' },
                  { label: 'M', value: '1.2rem' },
                  { label: 'L', value: '1.5rem' },
                  { label: 'XL', value: '1.8rem' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`px-2 py-1 rounded ${
                      fontSize === size.value ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                    } hover:bg-indigo-300 text-xs`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Lyrics Area */}
            <div
              ref={lyricsRef}
              onScroll={() => {
                setIsUserScrolling(true);
                clearTimeout(scrollTimer.current);
                scrollTimer.current = setTimeout(() => {
                  setIsUserScrolling(false);
                }, 5000); // 5 seconds after scroll stops
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

          {/* Right: Album Cover + Ad */}
          <div className="w-full lg:w-[500px] flex flex-col items-center gap-4">
            {selectedSong.coverImage && (
              <img
                src={selectedSong.coverImage}
                alt={`${selectedSong.title} cover`}
                className="w-full max-w-[500px] rounded-xl shadow-lg object-cover"
              />
            )}

            <div className="w-full max-w-[500px] h-32 bg-white/30 border-2 border-dashed border-white rounded-lg flex items-center justify-center text-white text-sm">
              🔲 Ad or Promo Space
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
