import React from 'react'
import { MiniMap } from './MiniMap'
import { Gauges } from './Gauges'
import { Settings } from './Settings'

export const Sidebar: React.FC = () => {
  return (
    <div style={{ width: '380px', height: '1080px'}}>
      <MiniMap/>
      <Gauges/>
      <Settings/>
    </div>
  )
}
