
import React from 'react';
import { FaSpotify, FaEllipsisH } from 'react-icons/fa';
import { BiSearchAlt} from "react-icons/bi";
import"../Styles/LeftMenu.css";
import { Menu } from './Menu';
import { MenuList } from './MenuList';
import { MenuPlayList } from './MenuPlayList';
import { TrackList } from './TrackList';

function LeftMenu() {
  return (
    <div className="LeftMenu">
      <div className="logoContainer">
        <i> <FaSpotify /> </i>
        <h2> YellowFy </h2>
        <i> <FaEllipsisH /> </i>
      </div>
      <div className="SearchBox">
        <input type="text" placeholder='Que souhaitez-vous écouter?' /> 
        <i className="SearchIcon"> <BiSearchAlt/> </i>
        </div>

        <Menu title={"Menu"} menuObject={MenuList} />

        <MenuPlayList/>
        <TrackList/>
    </div>
  );
}

export { LeftMenu };
