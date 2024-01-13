import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoom, leaveRoom, userJoined, userLeft } from '../redux/reducers/socketReducer'; // Update this path according to your project structure

let socket;

const Paired = () => {
  const [roomInput, setRoomInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const { roomId, usersInRoom } = useSelector(state => state.socket);

  useEffect(() => {
    socket = io.connect(`${process.env.REACT_APP_BASE_URL}`, { reconnection: false });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('userJoined', (userId) => {
      if (userId !== socket.id) {
        toast.success(`User ${userId} joined the room`);
        dispatch(userJoined(userId));
      }
    });

    socket.on('userLeft', (userId) => {
      toast.error(`User ${userId} left the room`);
      dispatch(userLeft(userId));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [dispatch]);

  const handleJoinRoom = () => {
    if (!isConnected) {
      console.log('Not connected to server');
      return;
    }
    socket.emit('joinRoom', roomInput);
    dispatch(joinRoom(roomInput));
    setRoomInput('');
  };

  const handleCreateRoom = () => {
    if (!isConnected) {
      console.log('Not connected to server');
      return;
    }
    const newRoomId = Math.random().toString(36).substr(2, 9);
    socket.emit('createRoom', newRoomId);
    dispatch(joinRoom(newRoomId));
  };

  const handleReconnect = () => {
    socket.connect();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black bg-opacity-80">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Paired Listening</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Enter Room ID"
          className="p-2 rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button 
          onClick={handleJoinRoom}
          className="bg-yellow-500 text-white px-4 rounded-r-md hover:bg-yellow-600"
        >
          Join Room
        </button>
      </div>
      <button 
        onClick={handleCreateRoom}
        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600"
      >
        Create Room
      </button>
      {roomId && (
        <div>
          <p className="text-white mt-4">Currently in room: {roomId}</p>
          <div className="mt-4">
            <p className="text-white">Users in Room:</p>
            {usersInRoom.map((user, index) => (
              <p key={index} className="text-yellow-400">{user}</p>
            ))}
          </div>
        </div>
      )}
      {!isConnected && 
        <button onClick={handleReconnect} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
          Reconnect
        </button>
      }
    </div>
  );
};

export default Paired;
