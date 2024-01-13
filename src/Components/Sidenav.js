import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/logo.jpeg';
import { FaEllipsisH, FaSearch, FaCompactDisc, FaTrashAlt, FaPlus, FaMicrophoneAlt, FaPodcast, FaBroadcastTower } from 'react-icons/fa';
import { BsFillHouseFill, BsJournalAlbum } from 'react-icons/bs';

const MenuList = [
  {
    id: 1,
    icon: <BsFillHouseFill />,
    name: "Accueil",
    path: "/home",
  },
  {
    id: 2,
    icon: <BsJournalAlbum />,
    name: "Albums",
    path: "/albums",
  },
  {
    id: 3,
    icon: <FaBroadcastTower />,
    name: "musics",
    path: "/musics",
  },
  {
    id: 4,
    icon: <FaMicrophoneAlt />,
    name: "Artist",
    path: "/artists",
  },
  {
    id: 5,
    icon: <FaPodcast />,
    name: "Paired listening",
    path: "/rooms",
  },
];

const playlistItems = [
  { id: 1, name: 'top Hit 2021' },
  { id: 2, name: 'Dance' },
  { id: 3, name: 'relaxe' },
  { id: 4, name: 'techno Music' },
  { id: 5, name: 'Arabe Music' },
  { id: 6, name: 'Rap' },
];

const Sidenav = () => {
  return (
    <div className='z-2 h-screen w-[300px] bg-black bg-opacity-70 text-white p-4'>
      <div className='flex flex-row justify-between items-center mb-4'>
        <img src={Logo} alt='Logo' className='h-12 mr-2' />
        <h1 className='text-yellow-500 text-2xl font-bold'>Yellowfy</h1>
        <FaEllipsisH className='text-yellow-500 text-2xl' />
      </div>

      {/* Search input */}
      <div className='relative mb-4'>
        <input
          type='text'
          placeholder='Que souhaitez-vous écouter?'
          className='bg-black bg-opacity-50 text-white p-2 pl-8 w-full rounded'
        />
        <FaSearch className='absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 text-xl' />
      </div>

      {/* Menu section */}
      <div className='text-yellow-500 text-xl font-bold mb-2'>Menu</div>
      <div className='flex flex-col'>
        {MenuList.map(item => (
          <Link to={item.path} key={item.id} className='flex items-center mb-2 cursor-pointer hover:border-l-2 hover:border-yellow-500 pl-2 pr-4'>
            <div className="mr-2">{item.icon}</div>
            {item.name}
          </Link>
        ))}
      </div>

      {/* Playlist section */}
      <div className='text-yellow-500 text-xl font-bold mb-2 mt-4 flex items-center justify-between'>
        Playlists
        <FaPlus className='cursor-pointer' />
      </div>
      <div className='flex flex-col overflow-y-auto'>
        {playlistItems.map(item => (
          <div
            key={item.id}
            className='flex items-center mb-2 cursor-pointer hover:bg-yellow-500 hover:text-black pl-2 pr-4'
          >
            <div className="mr-2"><FaCompactDisc /></div>
            {item.name}
            <div className="ml-auto"><FaTrashAlt /></div>
          </div>
        ))}
      </div>

      {/* Add more content, icons, or menu items as needed */}
    </div>
  );
}

export default Sidenav;
