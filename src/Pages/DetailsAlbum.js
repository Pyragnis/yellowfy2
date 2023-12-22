import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Player from '../Components/Player';

const DetailsAlbum = () => {
  const { albumId } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5432/albums/${albumId}`);
        setAlbumDetails(response.data);
      } catch (error) {
        console.error('Error fetching album details:', error.message);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return; // The item was dropped outside the list
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedMusic = Array.from(albumDetails.Music);
    const [removed] = updatedMusic.splice(startIndex, 1);
    updatedMusic.splice(endIndex, 0, removed);

    // Update the state with the new order
    setAlbumDetails((prevDetails) => ({
      ...prevDetails,
      Music: updatedMusic,
    }));
  };

  const handlePlayClick = (musicId) => {
    setSelectedMusicId(musicId);
  };

  return (
    <div className="bg-black bg-opacity-80 h-screen w-full p-8 text-white">
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="musicList">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {albumDetails.Music.map((music, index) => (
                      <Draggable key={music.music_id} draggableId={music.music_id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg mb-2"
                          >
                            <div className="flex items-center">
                              <FaPlay
                                className="text-yellow-500 mr-4"
                                onClick={() => handlePlayClick(music.music_id)}
                              />
                              {music.title}
                            </div>
                            <div>Drag</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {selectedMusicId && (
            <Player
              musicArray={albumDetails.Music}
              selectedMusicId={selectedMusicId}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailsAlbum;
