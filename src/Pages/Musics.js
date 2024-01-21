import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Player from '../Components/Player';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import { setSearchQuery } from '../redux/reducers/searchReducer';
import { leaveRoom, clearRoomId } from '../redux/reducers/socketReducer'; // Import the new actions

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

const Musics = () => {
  const [musics, setMusics] = useState([]);
  const [selectedMusicId, setSelectedMusicId] = useState('');
  const [coverurl, setCoverUrl] = useState('');
  const [song, setSong] = useState('');

  const dispatch = useDispatch();
  const { roomId } = useSelector((state) => state.socket); // Get roomId from Redux store
  const searchQuery = useSelector((state) => state.search.searchQuery); // Get searchQuery from Redux store
  const [musicOrder, setMusicOrder] = useState([]); // State to store the order of music

  const handlePlayClick = (musicId) => {
    setSelectedMusicId(musicId);
  };

  const handleClosePlayer = () => {
    setSelectedMusicId(null);
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', roomId);
    dispatch(leaveRoom(roomId)); // Dispatch the leaveRoom action
    dispatch(clearRoomId(roomId)); // Dispatch the clearRoomId action
    toast.success('You left the room', {
      icon: '👋',
      style: {
        backgroundColor: '#ff5722',
        color: '#fff',
      },
    });
  };

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
    const reorderedMusics = [...musics];
    const sourceIndex = reorderedMusics.findIndex((music) => music.music_id === sourceMusicId);
    const targetIndex = reorderedMusics.findIndex((music) => music.music_id === targetMusicId);

    // Swap the source and target music items
    const [movedItem] = reorderedMusics.splice(sourceIndex, 1);
    reorderedMusics.splice(targetIndex, 0, movedItem);

    setMusicOrder(reorderedMusics.map((music) => music.music_id));
    setMusics(reorderedMusics);
  };

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/music`
        );
        const musicIds = response.data.map((music) => music.music_id);
        setMusics(response.data);
        setMusicOrder(musicIds); // Set the initial music order based on data
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };

    fetchMusics();
  }, []);

  useEffect(() => {
    const fetchMusicById = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/music/${selectedMusicId}`
        );
        setSong(response.data.music);
        setCoverUrl(response.data.music?.albumCoverImageUrl);
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };

    fetchMusicById();
  }, [selectedMusicId]);

  useEffect(() => {
    const handleUserJoinRoom = (data) => {
      toast.success(`User ${data.socketId} joined the room`, {
        icon: '👋',
        style: {
          backgroundColor: '#ff5722',
          color: '#fff',
        },
      });
    };

    socket.on('connect', () => {
      // Emit an event to join the room when connected
      socket.emit('joinRoom', {
        roomId: roomId, // Provide the room ID from Redux store
      });
    });

    socket.on('roomUpdate', handleUserJoinRoom);

    return () => {
      socket.off('roomUpdate', handleUserJoinRoom);
      socket.disconnect();
    };
  }, [roomId]);

  // Filter musics based on searchQuery
  const filteredMusics = searchQuery
    ? musics.filter((music) =>
        music.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : musics;

  return (
    <>
      <div className="bg-black bg-opacity-70 min-h-screen p-4">
        <h1 className="text-3xl text-yellow-400 mb-4">Music Library</h1>
        {roomId && (
          <div className="mb-4">
            <p className="text-white">Room ID: {roomId}</p>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Leave Room
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMusics.map((music) => {
            return (
              <div
                key={music.music_id}
                className="bg-gray-800 bg-opacity-80 p-4 rounded-lg"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, music.music_id)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, music.music_id)}
              >
                <img
                  src={music.albumCoverImageUrl || 'default-cover-url.jpg'}
                  alt={music.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h2 className="text-xl text-yellow-400">{music.title}</h2>
                <p className="text-gray-300">Artist: {music.Artist?.name}</p>
                <p className="text-gray-300">Album: {music.Album?.title}</p>
                <p className="text-gray-300">Genre: {music.Album?.genre}</p>
                <p className="text-gray-300">
                  Release Date:{' '}
                  {new Date(music.Album?.release_date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handlePlayClick(music.music_id)}
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                >
                  <FaPlay className="mr-2" />
                  Play
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {selectedMusicId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Player
            musicArray={musics}
            selectedMusicId={selectedMusicId}
            imageurl={coverurl}
            onClose={handleClosePlayer}
            roomId={roomId}
          />
        </div>
      )}
    </>
  );
};

export default Musics;
