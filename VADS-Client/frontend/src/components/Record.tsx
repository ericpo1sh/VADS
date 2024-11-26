import React from 'react'

export const Record: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '12%', height: '92%', margin: '7px 0px 7px 19px', borderRadius: '20px 20px 20px 20px', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
      <button style={{ width: '75%', border: '2px solid #098800', borderRadius: '10px', height: '30%', backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, cursor: 'pointer' }}><p style={{ fontSize: '30px', fontFamily: 'Roboto Mono', fontWeight: 700 }}>START</p></button>
      <button style={{ width: '75%', border: '2px solid #F00', borderRadius: '10px', height: '30%', backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer' }}><p style={{ fontSize: '30px', fontFamily: 'Roboto Mono', fontWeight: 700, }}>STOP</p></button>
      <p className='recording-time' style={{ color: '#F00', fontSize: '24px', fontFamily: 'Roboto Mono', marginTop: '7px', fontWeight: 600 }}>00:00</p>
    </div>
  )
}

