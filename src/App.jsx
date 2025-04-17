import React, { useState, useRef, useEffect } from 'react';
import songs from './songs';
import CustomAudioPlayer from './components/CustomAudioPlayer';
import MobileApp from './components/MobileApp';
import useIsMobile from './hooks/useIsMobile';

function App() {
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [fontSize, setFontSize] = useState('1.2rem');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMobile = useIsMobile();

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

  if (isMobile) {
    return (
      <MobileApp
        selectedSong={selectedSong}
        setSelectedSong={setSelectedSong}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedArtist={selectedArtist}
        setSelectedArtist={setSelectedArtist}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        filteredSongs={filteredSongs}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        fontSize={fontSize}
        setFontSize={setFontSize}
        audioRef={audioRef}
        lyricsRef={lyricsRef}
        isUserScrolling={isUserScrolling}
        setIsUserScrolling={setIsUserScrolling}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        getActiveLyricIndex={getActiveLyricIndex}
      />
    );
  }

  // 💻 Desktop Layout (unchanged for now)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-800 to-purple-900 text-white p-4 font-sans flex flex-col lg:flex-row">
      {/* Insert desktop layout here or keep splitting if needed */}
      <div className="text-center w-full">💻 Desktop version under construction or reuse your old layout</div>
    </div>
  );
}

export default App;
