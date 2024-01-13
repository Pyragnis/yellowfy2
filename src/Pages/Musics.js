import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import Player from "../Components/Player";

const Musics = () => {
  const [musics, setMusics] = useState([]);
  const [selectedMusicId, setSelectedMusicId] = useState();
  const [coverurl, setCoverUrl]= useState('')
  const [song, setSong] = useState([])

  const handlePlayClick = (musicId) => {
    console.log(musicId, "helooooooo")
    setSelectedMusicId(musicId);
  };

  const handleClosePlayer = () => {
    setSelectedMusicId(null);
  };

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/music`);
        setMusics(response.data);
      } catch (error) {
        console.error("Error fetching music:", error);
      }
    };

    fetchMusics();
  }, []);

  useEffect(() => {
    const fetchMusicByid = async () => {
      try {
        console.log(selectedMusicId, "666666666666")
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/music/${selectedMusicId}`);
        console.log(response.data.music)
        setSong(response.data.music);
        setCoverUrl(response.data.music?.albumCoverImageUrl)
      } catch (error) {
        console.error("Error fetching music:", error);
      }
    };

    fetchMusicByid();
  }, [selectedMusicId]);

  return (
    <>
      <div className="bg-black bg-opacity-70 min-h-screen p-4">
        <h1 className="text-3xl text-yellow-400 mb-4">Music Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musics.map((music) => (
            <div
              key={music.music_id}
              className="bg-gray-800 bg-opacity-80 p-4 rounded-lg"
            >
              <img
                src={music.albumCoverImageUrl || "default-cover-url.jpg"}
                alt={music.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl text-yellow-400">{music.title}</h2>
              <p className="text-gray-300">Artist: {music.Artist?.name}</p>
              <p className="text-gray-300">Album: {music.Album?.title}</p>
              <p className="text-gray-300">Genre: {music.Album?.genre}</p>
              <p className="text-gray-300">
                Release Date:{" "}
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
          ))}
        </div>
      </div>
      {selectedMusicId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Player
            musicArray={musics}
            selectedMusicId={selectedMusicId}
            imageurl={coverurl}
            onClose={handleClosePlayer}
          />
        </div>
      )}
      : (<p>Loading...</p>)
    </>
  );
};

export default Musics;
