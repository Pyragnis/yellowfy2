import React, { useState, useEffect } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaExpand, FaCompress, FaStepBackward, FaStepForward, FaTimes, FaPlay, FaPause } from 'react-icons/fa';
import '../Styles/player.css';

const Player = ({ musicArray, selectedMusicId, imageurl, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(musicArray.findIndex(music => music.music_id === selectedMusicId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    setSelectedMusicIndex(musicArray.findIndex(music => music.music_id === selectedMusicId));
  }, [musicArray, selectedMusicId]);

  const toggleFullScreen = () => {
    const playerContainer = document.getElementById('player-container');
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement != null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleMusicChange = (direction) => {
    let newIndex = direction === 'next' ? (selectedMusicIndex + 1) % musicArray.length : (selectedMusicIndex - 1 + musicArray.length) % musicArray.length;
    setSelectedMusicIndex(newIndex);
  };

  const handleListen = (e) => {
    setCurrentTime(e.target.currentTime);
    setTotalDuration(e.target.duration);
  };

  const formatTime = (seconds) => {
    const rounded = Math.floor(seconds);
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const selectedMusic = musicArray[selectedMusicIndex] || {};

  return (
    <div id="player-container" className={`flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full z-50 ${isFullScreen ? 'full-screen' : ''}`} style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <button onClick={onClose} className="absolute top-5 right-5 focus:outline-none">
        <FaTimes className="text-white text-xl" />
      </button>
      {isFullScreen && (
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imageurl})`, filter: 'brightness(50%)' }}></div>
      )}

      <AudioPlayer
        autoPlay
        src={selectedMusic.musicUrl || selectedMusic.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => handleMusicChange('next')}
        onListen={handleListen}
        showSkipControls={true}
        onClickPrevious={() => handleMusicChange('prev')}
        onClickNext={() => handleMusicChange('next')}
        className={`${isFullScreen ? 'rounded-none' : 'rounded-lg'} bg-transparent overflow-hidden relative`}
        customProgressBarSection={[
          RHAP_UI.PROGRESS_BAR,
          <div key="current-time" className="text-white mx-2">{formatTime(currentTime)}</div>,
          RHAP_UI.DURATION,
          <div key="total-duration" className="text-white mx-2">{formatTime(totalDuration)}</div>
        ]}
        customAdditionalControls={[
          // <button key="prev" onClick={() => handleMusicChange('prev')} className="focus:outline-none">
          //   <FaStepBackward className="text-white text-xl" />
          // </button>,
          // isPlaying
          //   ? <button key="pause" onClick={() => setIsPlaying(false)} className="focus:outline-none">
          //       <FaPause className="text-white text-xl" />
          //     </button>
          //   : <button key="play" onClick={() => setIsPlaying(true)} className="focus:outline-none">
          //       <FaPlay className="text-white text-xl" />
          //     </button>,
          // <button key="next" onClick={() => handleMusicChange('next')} className="focus:outline-none">
          //   <FaStepForward className="text-white text-xl" />
          // </button>,
          <button key="fullscreen" onClick={toggleFullScreen} className="focus:outline-none">
            {isFullScreen ? <FaCompress className="text-yellow-500 text-2xl" /> : <FaExpand className="text-yellow-500 text-xl" />}
          </button>
        ]}
        header={
          <div className="relative w-full h-72 overflow-hidden">
            <img src={imageurl} alt="Album Cover" className={`w-full h-full object-cover ${isFullScreen ? 'max-h-full' : ''}`} />
            {isFullScreen && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>}
          </div>
        }
        layout="stacked-reverse"
      />
    </div>
  );
};

export default Player;
