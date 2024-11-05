import React from 'react';
import TemplateDroneFootage from '../assets/template_drone_footage.jpg'

export const VideoContainer: React.FC = () => {
  return (
    <div className='flex'>
      <img src={TemplateDroneFootage} alt="Temporary Drone Footage" style={{ border: '2px solid black'}}/>
    </div>
  )
}

