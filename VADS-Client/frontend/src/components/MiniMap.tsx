import React from 'react'
import GtaMiniMap from '../assets/gtaMiniMap.webp'

export const MiniMap: React.FC = () => {
  return (
    <div>
      <img src={GtaMiniMap} alt="gta mini map" width={'380'} height={'270'} style={{ border: '4px solid white' }} />
    </div>
  )
}

