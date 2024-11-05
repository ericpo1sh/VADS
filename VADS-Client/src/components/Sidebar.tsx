import React from 'react'
import { MiniMap } from './MiniMap'
import { Gauges } from './Gauges'
import { Settings } from './Settings'

export const Sidebar: React.FC = () => {
  return (
    <div className='flex-col flex'>
      <MiniMap/>
      <Gauges/>
      <Settings/>
    </div>
  )
}
