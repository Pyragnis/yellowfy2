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

  // Create a state variable to track whether the user has pressed the "seek" button
  const [seeking, setSeeking] = useState(false);

  // Initialize Socket.io connection
  const socket = io(process.env.REACT_APP_BASE_URL);

  // Event listener for 'play' event from the server
  socket.on('play', () => {
    // Handle the 'play' event from the server
    setIsPlaying(true); // Update playback state
    console.log('Received play event from the server');
  });

  // Event listener for 'pause' event from the server
  socket.on('pause', () => {
    // Handle the 'pause' event from the server
    setIsPlaying(false); // Update playback state
    console.log('Received pause event from the server');
  });

  // Event listener for 'changeTrack' event from the server
  socket.on('changeTrack', (trackId) => {
    // Handle the 'changeTrack' event from the server
    console.log('Received changeTrack event from the server, Track ID:', trackId);
    
    // Add your logic to change the track here (if needed)
    // For example, you can update the selected music index based on trackId
    const newIndex = musicArray.findIndex((music) => music.music_id === trackId);
    if (newIndex !== -1) {
      setSelectedMusicIndex(newIndex);
    }
  });

  // Event listener for 'seek' event from the server
  socket.on('seek', (time) => {
    // Update the current playback time only if not seeking
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

  // Modify the handleSeek function to emit the "seek" event only when the button is pressed
  const handleSeek = (time) => {
    if (seeking) {
      // Emit a socket event for seeking with the roomId and current time
      socket.emit('seek', roomId, time);

      // Update the current playback time
      setCurrentTime(time);

      // Reset the seeking state after emitting the event
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
        currentTime={currentTime} // Set the current playback time
        onListen={(e) => {
          // Emit a socket event for seeking with the roomId and current time
          // console.log(socket.connected)
          // socket.emit('seek', roomId, e.target.currentTime);

          // Update the current playback time only if not seeking
          if (!seeking) {
            setCurrentTime(e.target.currentTime);
          }
        }}
        playing={isPlaying} // Set the playback state
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

      {/* Add a "seek" button */}
      <button onClick={() => setSeeking(true)}>Seek</button>
    </div>
  );
};

export default Player;
