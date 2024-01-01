import React, { useState, useEffect } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaExpand, FaCompress, FaStepBackward, FaStepForward } from 'react-icons/fa';

const Player = ({ musicArray, selectedMusicId, Imageurl }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setSelectedMusic(musicArray.find((music) => music.music_id === selectedMusicId));
  }, [musicArray, selectedMusicId]);

  const toggleFullScreen = () => {
    const playerContainer = document.getElementById('player-container');

    if (playerContainer) {
      try {
        if (!document.fullscreenElement) {
          playerContainer.requestFullscreen();
        } else {
          document.exitFullscreen();
        }

        setIsFullScreen(!isFullScreen);
      } catch (error) {
        console.error('Fullscreen API error:', error.message);
      }
    } else {
      console.error('Player container not found.');
    }
  };

  const handleMusicChange = (direction) => {
    const currentIndex = musicArray.findIndex((music) => music.music_id === selectedMusicId);
    const newIndex =
      direction === 'next' ? (currentIndex + 1) % musicArray.length : (currentIndex - 1 + musicArray.length) % musicArray.length;

    // Handle music change logic here
    console.log('Changing music to:', musicArray[newIndex].music_id);
  };

  const handleProgress = (e) => {
    setProgress(e.target.currentTime / e.target.duration);
  };

  return (
    <div
      id="player-container"
      className={`max-w-screen-md mx-auto ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}
    >
      {isFullScreen && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${selectedMusic.imageUrl})` }}
        ></div>
      )}

      <AudioPlayer
        autoPlay
        src={selectedMusic ? selectedMusic.musicUrl : ''}
        onPlay={(e) => console.log('onPlay')}
        onTimeUpdate={handleProgress}
        onEnded={() => handleMusicChange('next')}
        onPause={() => handleMusicChange('next')}
        className={`${
          isFullScreen ? 'rounded-none' : 'rounded-lg'
        } bg-black bg-opacity-70 overflow-hidden relative`}
        customAdditionalControls={[
          <button key="fullscreen" onClick={toggleFullScreen} className="focus:outline-none">
            {isFullScreen ? <FaCompress className="text-yellow-500 text-xl" /> : <FaExpand className="text-yellow-500 text-xl" />}
          </button>,
        ]}
        header={
          <div className="relative w-full h-72 overflow-hidden">
            <img
              src={Imageurl}
              alt="Song Cover"
              className={`w-full h-full object-cover ${isFullScreen ? 'max-h-full' : ''}`}
            />
            {isFullScreen && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>}
          </div>
        }
        layout="stacked-reverse"
        customControls={[
          'play',
          'time_and_duration',
          'seekbar',
          'volume',
          'spacer',
          'name',
          'custom-additional-controls',
        ]}
        customProgressBarSection={[
          RHAP_UI.PROGRESS_BAR,
          <div key="progress" className="text-white mx-2">
            {`${Math.floor(progress * 100)}%`}
          </div>,
        ]}
      />

      <style>
        {`
          .rhap_header {
            background: none !important;
          }
          .rhap_main-controls {
            background: rgba(0, 0, 0, 0.7) !important;
            border-radius: 8px;
            padding: 8px;
          }
          .rhap_additional-controls {
            background: none !important;
          }
          .rhap_progress-section {
            background: none !important;
          }
          .rhap_container {
            background-color: rgba(34, 34, 34, 0.7) !important;
            border-radius: 8px;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default Player;
