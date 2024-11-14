import React, { useState } from "react";
import user_icon from '../assets/user-icon.webp';

export const Account: React.FC = () => {
  const [showStats, setShowStats] = useState(false);

  const handleViewStats = () => {
    setShowStats(!showStats);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '25%', height: '92%', margin: '7px 0px 7px 7px', borderRadius: '0px 20px 20px 0px', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: "center", margin: '0px 0px 0px -15px' }}>
          <img src={user_icon} alt="placeholder user pic" width={'165px'} height={'100px'} />
          <p style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '32px' }}>Hello User</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: '10px' }}>
          <button style={{ backgroundColor: 'white', border: '2px solid black', width: '150px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginLeft: '6px' }}>Logout</button>
          <button onClick={handleViewStats} style={{ backgroundColor: 'white', border: '2px solid black', width: '175px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginRight: '10px' }}>View Stats</button>
        </div>
      </div>

      {showStats && (
        <div style={{ position: 'absolute', bottom: '100%', left: '5px', backgroundColor: '#D9D9D9', border: '2px solid black', borderRadius: '20px 20px 0px 0px', width: '22.3%', height: '400px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', transform: 'translateY(-12px)', stroke: '2px black solid' }}>
          <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '28px' }}>User Stats</h2>
          <p>Here are your stats...</p>
          <button onClick={handleViewStats} style={{ backgroundColor: '#D9D9D9', border: '2px solid black', width: '100px', height: '40px', fontWeight: '600', fontSize: '18px', borderRadius: 10, fontFamily: 'Roboto Mono', marginTop: '20px' }}>Close</button>
        </div>
      )}
    </div>
  );
};
