import React from 'react'

export const Record: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '15%', height: '92%', margin: '7px 0px 7px 19px', borderRadius: '20px 20px 20px 20px', justifyContent: 'space-evenly', alignContent: 'center', alignItems: 'center' }}>
      <button style={{ width: '75%',  }}>START</button>
      <button>STOP</button>
      <p className='recording-time'>01:48</p>
    </div>
  )
}

