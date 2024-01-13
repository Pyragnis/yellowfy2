import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [loadedAlbums, setLoadedAlbums] = useState(6); 
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAlbums();
  }, []);

  const getAllAlbums = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/albums/`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error.message);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    navigate(`/details/${album.album_id}`);
  };

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setLoadedAlbums((prevLoadedAlbums) => prevLoadedAlbums + 1);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, 
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [loadedAlbums]); 

  return (
    <div className="bg-black bg-opacity-80 min-h-screen w-full p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
      <div className="grid grid-cols-3 gap-8" ref={containerRef}>
        {albums.slice(0, loadedAlbums).map((album) => (
          <div
            key={album.album_id}
            className="relative group cursor-pointer p-4 bg-gray-700 bg-opacity-50 rounded-lg transition-opacity"
            onClick={() => handleAlbumClick(album)}
            onMouseEnter={() => setIsHovered(album.album_id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <img
              src={album.albumCover || 'default-cover-url'}
              alt={album.title}
              className={`w-full h-48 object-cover rounded-lg ${
                isHovered === album.album_id ? 'filter brightness-75' : ''
              }`}
            />
            {(selectedAlbum && selectedAlbum.album_id === album.album_id) || isHovered === album.album_id ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay className="h-12 w-12 text-yellow-500" />
              </div>
            ) : null}
            <div className="mt-2 text-white">{album.title}</div>
            <div className="text-gray-500">{album.genre}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Albums;
