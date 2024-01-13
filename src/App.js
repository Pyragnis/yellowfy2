import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidenav from './Components/Sidenav';
import Player from './Components/Player';
import Albums from './Pages/Albums';
import AlbumDetails from './Pages/DetailsAlbum'
import Paired from './Pages/Paired'
import Musics from './Pages/Musics';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="App flex relative w-full min-h-screen">
      <Toaster
          position="top-right"
          toastOptions={{
            className: "",
            duration: 2000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <div className="background -z-1"></div>
        <Sidenav />
        <div className="overlay-container h-screen w-full">
          <Routes>
            <Route path="/albums" element={<Albums />} />
            <Route path="/details/:albumId" element={<AlbumDetails />} />
            <Route path="/rooms" element={<Paired/>} />
            <Route path="/musics" element={<Musics/>} />
          </Routes>
        </div>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
