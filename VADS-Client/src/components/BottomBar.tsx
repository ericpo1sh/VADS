import React from "react"
import { Account } from "./Account"
import { Record } from "./Record"

export const BottomBar: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '215px', border: '4px white solid', marginTop: '-5px' }}>
      <Account/>
      <Record/>
    </div>
  )
}
