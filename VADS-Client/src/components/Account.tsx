import React, { useState } from "react";
import user_icon from '../assets/user-icon.webp';
import './styles/Account.css';

export const Account: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleViewStats = () => {
    setShowStats((prev) => !prev);
    if (!showStats) {
      setShowLogin(false);
      setIsSignup(false);
    }
  };

  const handleShowLogin = () => {
    setShowLogin((prev) => !prev);
    if (!showLogin) {
      setShowStats(false);
      setIsSignup(false);
    }
  };

  const handleShowSignup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsSignup(true);
  };

  return (
    <div style={{ position: 'relative', width: '25%', zIndex: 0 }}>
      <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '100%', height: '92%', margin: '7px 0px 7px 7px', borderRadius: '0px 20px 20px 0px', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: "center", margin: '0px 0px 0px -15px' }}>
          <img src={user_icon} alt="placeholder user pic" width={'165px'} height={'100px'} />
          <p style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '32px' }}>Hello User</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: '10px' }}>
          <button onClick={handleShowLogin} style={{ backgroundColor: 'white', border: '2px solid black', width: '150px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginLeft: '6px' }}>Login</button>
          <button onClick={handleViewStats} style={{ backgroundColor: 'white', border: '2px solid black', width: '175px', height: '65px', fontWeight: '600', fontSize: '25px', borderRadius: 10, fontFamily: 'Roboto Mono', marginRight: '10px' }}>View Stats</button>
        </div>
      </div>

      <div className={`stats-panel ${showStats ? 'slide-up' : 'slide-down'}`}>
        <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Your Stats</h2>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
          <img src={user_icon} alt="placeholder user pic" width={'165px'} height={'100px'} />
          <h2>User</h2>
        </div>
        <div className="flight-data" style={{ width: '340px', height: '200px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
          <p>Total Flight Time: 48:12:04</p>
          <p>Highest Altitude: 1320ft </p>
          <p>Total Distance Flown: 3 miles</p>
          <p>Top Speed Reached: 42mph</p>
        </div>
      </div>
      <div className={`login-panel ${showLogin ? 'slide-up' : 'slide-down'}`}>
        {isSignup ? (
          <>
            <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Signup</h2>
            <div style={{ width: '340px', height: '340px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              <form style={{ display: "flex", flexDirection: 'column', gap: 15, marginTop: 25 }}>
                <input type="text" placeholder="Username" className="login-input" />
                <input type="password" placeholder="Password" className="login-input" />
                <button type="submit" className="login-button">Signup</button>
              </form>
              <p style={{ marginTop: '10px', fontFamily: 'Roboto Mono', fontSize: '16px', width: '230px', textAlign: "center" }}>
                Already have an account? <a href="#login" className="signup-link" onClick={() => setIsSignup(false)}>Login Here</a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Roboto Mono', fontWeight: 700, fontSize: '38px', marginTop: 0, marginBottom: 20 }}>Login</h2>
            <div style={{ width: '340px', height: '340px', border: '2px solid black', backgroundColor: 'white', alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              <form style={{ display: "flex", flexDirection: 'column', gap: 15, marginTop: 25 }}>
                <input type="text" placeholder="Username" className="login-input" />
                <input type="password" placeholder="Password" className="login-input" />
                <button type="submit" className="login-button">Login</button>
              </form>
              <p style={{ marginTop: '10px', fontFamily: 'Roboto Mono', fontSize: '16px', width: '230px', textAlign: "center" }}>
                Don't have an account? <a href="#signup" className="signup-link" onClick={handleShowSignup}>Signup Here</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
