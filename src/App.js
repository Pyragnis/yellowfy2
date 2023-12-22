import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidenav from './Components/Sidenav';
import Player from './Components/Player';
import Albums from './Pages/Albums';
import AlbumDetails from './Pages/DetailsAlbum'

function App() {
  const songurl =
    'https://yellowfy.s3.eu-west-3.amazonaws.com/4c19dd6ad93db9a1ff1cf69333bf19af0709938a96a1c1bddef5292f91066a3d.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4XITKHRTD2OIYOFL%2F20231222%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20231222T000420Z&X-Amz-Expires=518400&X-Amz-Signature=0d8d49ce5e06f0217501d5989fabc3e62de8027537983c33ba4c56cb407cc6db&X-Amz-SignedHeaders=host&x-id=GetObject';
  const imageUrl =
    'https://yellowfy.s3.eu-west-3.amazonaws.com/3c832a86d3d0fd97fbfe2bffd209b8b8188d0c94b3e4a95be9f3fa2a09625915.avif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4XITKHRTD2OIYOFL%2F20231222%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20231222T002417Z&X-Amz-Expires=518400&X-Amz-Signature=eb65e08dd3811bcc6877ac35f1031fb5a79e9242339af036ad026e23e2d77722&X-Amz-SignedHeaders=host&x-id=GetObject';

  return (
    <Router>
      <div className="App flex relative w-full">
        <div className="background -z-1"></div>
        <Sidenav />
        <div className="overlay-container h-screen w-full">
          <Routes>
            <Route path="/albums" element={<Albums />} />
            <Route path="/details/:albumId" element={<AlbumDetails />} />
          </Routes>
          {/* <Player songUrl={songurl} imageUrl={imageUrl} /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
