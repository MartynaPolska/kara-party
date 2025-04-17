import React, { useState, useRef, useEffect } from 'react';
import songs from './songs';
import CustomAudioPlayer from './components/CustomAudioPlayer';
import { Turtle, Rabbit } from 'lucide-react';

function App() {
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [fontSize, setFontSize] = useState('1.2rem');
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const audioRef = useRef(null);
  const lyricsRef = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [selectedSong]);

  useEffect(() => {
    if (isUserScrolling) return;
    if (lyricsRef.current) {
      const active = lyricsRef.current.querySelector('.active-lyric');
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, isUserScrolling]);

  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArtist = selectedArtist === '' || song.artist === selectedArtist;
    const matchesGenre =
      (selectedArtist === 'All' && selectedGenre !== '' && song.genre === selectedGenre) ||
      selectedGenre === '';

    return matchesSearch && matchesArtist && matchesGenre;
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
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-800 to-purple-900 text-white p-4 font-sans flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white/10 rounded-xl p-4 space-y-4 overflow-y-auto">
        <a href="/" className="inline-block">
          <img
            src="/logo_miyurugee.png"
            alt="Miyuru Logo"
            className="h-12 w-auto object-contain hover:opacity-90 transition"
          />
        </a>

        <input
          type="text"
          placeholder="🔍 Search songs..."
          className="w-full px-4 py-2 rounded-md border focus:outline-none text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Artist Dropdown */}
        <select
          className="w-full px-4 py-2 rounded-md border text-black"
          value={selectedArtist}
          onChange={(e) => setSelectedArtist(e.target.value)}
        >
          <option value="">Select Artist</option>
          {[...new Set(songs.map(song => song.artist))].map((artist, idx) => (
            <option key={idx} value={artist}>{artist}</option>
          ))}
        </select>

        {/* Genre Dropdown */}
        <select
          className="w-full px-4 py-2 rounded-md border text-black"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Select genre</option>
          {[...new Set(songs.map(song => song.genre))].map((genre, idx) => (
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
      <div className="flex-1 lg:ml-4 bg-white text-black rounded-xl p-6 shadow-xl overflow-y-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-1">{selectedSong.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{selectedSong.artist} • {selectedSong.genre}</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Player + Lyrics */}
          <div className="flex-1 space-y-4">
            
            {/* Custom Audio Player */}
            <CustomAudioPlayer
              audioRef={audioRef}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
            />

            {/* Hidden HTML Audio Tag */}
            <audio
              ref={audioRef}
              src={selectedSong.audioUrl}
              preload="metadata"
              className="hidden"
            />

            {/* Font Size + Speed Controls */}
            <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
              
              <div className="flex items-center gap-2 text-sm">
<<<<<<< HEAD
                <span>Aa</span>
=======
                <span className="text-2xl font-semibold text-indigo-600">Aa</span>
>>>>>>> d345282 (Fix: new player)
                {[
                  { label: 'S', value: '1rem' },
                  { label: 'M', value: '1.2rem' },
                  { label: 'L', value: '1.5rem' },
                  { label: 'XL', value: '1.8rem' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`px-3 py-1 rounded ${
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

          {/* Right: Cover & Promo */}
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
