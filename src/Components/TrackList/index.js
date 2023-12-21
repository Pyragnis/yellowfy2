import React from 'react'
import { BsVolumeUpFill , BsMusicNoteList} from 'react-icons/bs';
import {FaDesktop} from 'react-icons/fa';
import Track from "../../img/track0.jpeg";

function TrackList() {
  return (
    <div className='tracklist'>
     <div className='top'> 
      <img src={Track} alt=''/> 
      <p className='trackname'> name song <span className='trackSpan'> Artist </span></p>
     </div>
    <div className='bottom'> 
    <i> <BsVolumeUpFill/></i>
    <input  type="range"/> 
    <i> <BsMusicNoteList/></i>
    <i> <FaDesktop/> </i>
    </div>
    </div>
  )
}

export  {TrackList}