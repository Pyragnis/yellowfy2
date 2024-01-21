import React, { useState, useEffect } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaExpand, FaCompress, FaTimes } from 'react-icons/fa'; // Add icons for fullscreen
import '../Styles/player.css';
import io from 'socket.io-client'; // Import Socket.io

const Player = ({ musicArray, selectedMusicId, imageurl, onClose, roomId }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(
    musicArray.findIndex((music) => music.music_id === selectedMusicId)
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    setSelectedMusicIndex(
      musicArray.findIndex((music) => music.music_id === selectedMusicId)
    );
  }, [musicArray, selectedMusicId]);

  const toggleFullScreen = () => {
    const playerContainer = document.getElementById('player-container');
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch((err) => {
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
    let newIndex =
      direction === 'next'
        ? (selectedMusicIndex + 1) % musicArray.length
        : (selectedMusicIndex - 1 + musicArray.length) % musicArray.length;
    setSelectedMusicIndex(newIndex);

    // Emit a socket event for changing the track with the roomId
    socket.emit('changeTrack', roomId, musicArray[newIndex].music_id);
  };

  const handleListen = (e) => {
    setCurrentTime(e.target.currentTime);
    setTotalDuration(e.target.duration);
    
    // Emit a socket event for seeking with the roomId
    socket.emit('seek', roomId, e.target.currentTime);
  };

  const formatTime = (seconds) => {
    const rounded = Math.floor(seconds);
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const selectedMusic = musicArray[selectedMusicIndex] || {};

  // Initialize Socket.io connection
  const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

  return (
    <div
      id="player-container"
      className={`flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full z-50 ${
        isFullScreen ? 'full-screen' : ''
      }`}
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
    >
      <button onClick={onClose} className="absolute top-5 right-5 focus:outline-none">
        <FaTimes className="text-white text-xl" />
      </button>
      {isFullScreen && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageurl})`, filter: 'brightness(50%)' }}
        ></div>
      )}

      <AudioPlayer
        autoPlay
        src={selectedMusic.musicUrl || selectedMusic.url}
        onListen={handleListen}
        showSkipControls={true}
        onClickPrevious={() => handleMusicChange('prev')}
        onClickNext={() => handleMusicChange('next')}
        className={`${isFullScreen ? 'rounded-none' : 'rounded-lg'} bg-transparent overflow-hidden relative`}
        customProgressBarSection={[
          RHAP_UI.PROGRESS_BAR,
          <div key="current-time" className="text-white mx-2">
            {formatTime(currentTime)}
          </div>,
          // RHAP_UI.DURATION,
          // <div key="total-duration" className="text-white mx-2">
          //   {formatTime(totalDuration)}
          // </div>
        ]}
        customAdditionalControls={[
          <button key="fullscreen" onClick={toggleFullScreen} className="focus:outline-none">
            {isFullScreen ? <FaCompress className="text-yellow-500 text-2xl" /> : <FaExpand className="text-yellow-500 text-xl" />}
          </button>
        ]}
        header={isFullScreen ? null : ( // Hide the player image in fullscreen
          <div className="relative w-full h-72 overflow-hidden">
            <img src={imageurl} alt="Album Cover" className={`w-full h-full object-cover`} />
          </div>
        )}
        layout="stacked-reverse"
      />
    </div>
  );
};

export default Player;
