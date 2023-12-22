import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaExpand, FaCompress } from 'react-icons/fa';

const Player = ({ songUrl, imageUrl }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const playerContainer = document.getElementById('player-container');

    if (playerContainer) {
      try {
        if (!document.fullscreenElement) {
          // Enter fullscreen
          playerContainer.requestFullscreen();
        } else {
          // Exit fullscreen
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

  return (
    <div
      id="player-container"
      className={`max-w-screen-md mx-auto ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}
    >
      {isFullScreen && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
      )}

      <AudioPlayer
        autoPlay
        src={songUrl}
        onPlay={(e) => console.log('onPlay')}
        // other props here
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
              src={imageUrl}
              alt="Song Cover"
              className={`w-full h-full object-cover ${isFullScreen ? 'max-h-full' : ''}`}
            />
            {isFullScreen && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>}
          </div>
        }
        layout="stacked-reverse"
      />

      {/* Hide the image inside controls div */}
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
