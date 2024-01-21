import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Player from '../Components/Player';

const DetailsAlbum = () => {
  const { albumId } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [selectedMusicId, setSelectedMusicId] = useState(null);
  const [musicOrder, setMusicOrder] = useState([]);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/albums/${albumId}`);
        setAlbumDetails(response.data);
        setMusicOrder(response.data.Music.map((music) => music.music_id)); // Set the initial music order
      } catch (error) {
        console.error('Error fetching album details:', error.message);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const handleDragStart = (e, musicId) => {
    e.dataTransfer.setData('text/plain', musicId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetMusicId) => {
    e.preventDefault();
    const sourceMusicId = e.dataTransfer.getData('text/plain');

    // Implement the logic to reorder music items based on source and target IDs
    const reorderedMusicOrder = [...musicOrder];
    const sourceIndex = reorderedMusicOrder.indexOf(sourceMusicId);
    const targetIndex = reorderedMusicOrder.indexOf(targetMusicId);

    // Swap the source and target music items
    const movedItem = reorderedMusicOrder.splice(sourceIndex, 1)[0];
    reorderedMusicOrder.splice(targetIndex, 0, movedItem);

    // Update the state with the new music order
    setMusicOrder([...reorderedMusicOrder]);
  };

  const handlePlayClick = (musicId) => {
    setSelectedMusicId(musicId);
  };

  const handleClosePlayer = () => {
    setSelectedMusicId(null);
  };

  return (
    <div className="relative bg-black bg-opacity-80 h-screen w-full p-8 text-white">
      {albumDetails ? (
        <>
          <img src={albumDetails.albumCoverImageUrl} alt={albumDetails.title} className="w-32 h-32 object-cover rounded-lg mb-4" />
          <h2 className="text-3xl font-bold mb-2">{albumDetails.title}</h2>
          <p className="text-gray-500">{albumDetails.genre}</p>
          <p className="mt-4">{albumDetails.description}</p>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Artist Details</h3>
            <p>{albumDetails.Artist.name}</p>
            <p>{albumDetails.Artist.bio}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Album Music</h3>
            <div
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, 'musicList')}
            >
              {musicOrder.map((musicId, index) => {
                const music = albumDetails.Music.find((m) => m.music_id === musicId);
                return (
                  <div
                    key={musicId}
                    className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg mb-2"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, musicId)}
                  >
                    <FaPlay
                      className="text-yellow-500 mr-4 cursor-pointer"
                      onClick={() => handlePlayClick(music.music_id)}
                    />
                    {music.title}
                    <div>Drag</div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedMusicId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Player
                musicArray={albumDetails.Music}
                selectedMusicId={selectedMusicId}
                imageurl={albumDetails.albumCoverImageUrl}
                onClose={handleClosePlayer}
              />
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailsAlbum;
