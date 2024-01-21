import React, { useState, useEffect } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaExpand, FaCompress, FaTimes } from 'react-icons/fa';
import '../Styles/player.css';
import io from 'socket.io-client';

const Player = ({ musicArray, selectedMusicId, imageurl, onClose, roomId }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(
    musicArray.findIndex((music) => music.music_id === selectedMusicId)
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [seeking, setSeeking] = useState(false);

  const socket = io(process.env.REACT_APP_BASE_URL);

  socket.on('play', () => {
    setIsPlaying(true); // Update playback state
    console.log('Received play event from the server');
  });

  socket.on('pause', () => {
    setIsPlaying(false); // Update playback state
    console.log('Received pause event from the server');
  });

  socket.on('changeTrack', (trackId) => {
    console.log('Received changeTrack event from the server, Track ID:', trackId);
    const newIndex = musicArray.findIndex((music) => music.music_id === trackId);
    if (newIndex !== -1) {
      setSelectedMusicIndex(newIndex);
    }
  });

  socket.on('seek', (time) => {
    if (!seeking) {
      setCurrentTime(time);
    }
    console.log('Received seek event from the server, Time:', time);
  });

  useEffect(() => {
    setSelectedMusicIndex(
      musicArray.findIndex((music) => music.music_id === selectedMusicId)
    );
  }, [musicArray, selectedMusicId]);

  
  const handleSeek = (time) => {
    if (seeking) {
      socket.emit('seek', roomId, time);

      setCurrentTime(time);

      setSeeking(false);
    }
  };

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
    const socket = io(process.env.REACT_APP_BASE_URL);

    let newIndex =
      direction === 'next'
        ? (selectedMusicIndex + 1) % musicArray.length
        : (selectedMusicIndex - 1 + musicArray.length) % musicArray.length;
    setSelectedMusicIndex(newIndex);


    console.log(socket.connected, "changetrackhas been calleed")

    // Emit a socket event for changing the track with the roomId
    socket.emit('changeTrack', roomId, musicArray[newIndex].music_id);
  };

  const formatTime = (seconds) => {
    const rounded = Math.floor(seconds);
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const selectedMusic = musicArray[selectedMusicIndex] || {};

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
        currentTime={currentTime} 
        onListen={(e) => {
          if (!seeking) {
            setCurrentTime(e.target.currentTime);
          }
        }}
        playing={isPlaying} 
        showSkipControls={true}
        onClickPrevious={() => handleMusicChange('prev')}
        onClickNext={() => handleMusicChange('next')}
        className={`${isFullScreen ? 'rounded-none' : 'rounded-lg'} bg-transparent overflow-hidden relative`}
        customProgressBarSection={[
          RHAP_UI.PROGRESS_BAR,
          <div key="current-time" className="text-white mx-2">
            {formatTime(currentTime)}
          </div>,
        ]}
        customAdditionalControls={[
          <button key="fullscreen" onClick={toggleFullScreen} className="focus:outline-none">
            {isFullScreen ? <FaCompress className="text-yellow-500 text-2xl" /> : <FaExpand className="text-yellow-500 text-xl" />}
          </button>
        ]}
        header={isFullScreen ? null : (
          <div className="relative w-full h-72 overflow-hidden">
            <img src={imageurl} alt="Album Cover" className={`w-full h-full object-cover`} />
          </div>
        )}
        layout="stacked-reverse"
      />
      <button onClick={() => setSeeking(true)}>Seek</button>
    </div>
  );
};

export default Player;
