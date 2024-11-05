import React from 'react'
import GtaMiniMap from '../assets/gtaMiniMap.webp'

export const MiniMap: React.FC = () => {
  return (
    <div className='' style={{ border: '2px solid black' }}>
      <img src={GtaMiniMap} alt="gta mini map" width={'400'} height={'270'} />
    </div>
  )
}

